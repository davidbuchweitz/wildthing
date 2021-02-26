'use strict';

let dns        = require('native-dns');
let server     = dns.createServer();
let async      = require('async');
let fs         = require('fs');
let options    = {};
let hosts      = [];
let hosts_file = (process.platform == 'win32') ? process.env.windir+'\\System32\\drivers\\etc\\hosts' : '/etc/hosts';

if (fs.existsSync("wildthing.conf"))
	options = JSON.parse(fs.readFileSync("wildthing.conf", "utf8"));
else
{
	console.error("Exiting: no wildthing.conf file found");
	process.exit();
}

function debug(data)
{
	if (options.debug)
		console.log('[' + new Date().toISOString().slice(0, 19).replace('T', ' ') + '] ' + data);
}

server.on('listening', function()
{
	debug('Listeing on ' + options.server.host + ':' + options.server.port);
});

server.on('request', function (request, response)
{
	debug('Request from: ' + request.address.address + ' for ' + request.question[0].name);

	let queue = [];

	request.question.forEach(function(question)
	{
		for (var h in hosts)
			if (question.name.match('.+' + hosts[h].domain.replace('.', '\\.') + '$'))
				return response.answer.push(dns['A']({name: question.name, ttl: 180, address: hosts[h].address}));

		queue.push(function(callback)
		{
			upstream(question, response, callback)
		});
	});

	async.parallel(queue, function()
	{
		for (var a in response.answer)
			if (response.answer[a].address != undefined)
				debug('Responding with ' + response.answer[a].address);

		response.send();
	});
});

function upstream(question, response, callback)
{
	debug('Looking up: ' + question.name);

	var request = dns.Request(
	{
		question: question,
		server: {address: options.upstream.host, port: options.upstream.port, type: 'udp'},
		timeout: options.upstream.timeout
	});

	request.on('message', function(error, message)
	{
		message.answer.forEach(function(answer)
		{
			response.answer.push(answer)
		});
	});

	request.on('end', callback);
	request.send();
}

function parseHosts()
{
	fs.readFile(hosts_file, 'utf8', function(error, data)
	{
		debug('Parsing hosts file...');

		hosts = [];

		let matches = Array.from(data.matchAll(/^([0-9\.]+)\s+\*([\w.-]+)/gm));

		if (matches.length > 0)
		{
			for (var m in matches)
				hosts.push({domain: (matches[m][2]).replace('*', ''), address: matches[m][1]});

			debug(hosts.length + ' wildcard host(s) found');

			for (var h in hosts)
				debug('*' + hosts[h].domain + ' => ' + hosts[h].address);
		}
		else debug('0 hosts found');
	});
}

fs.watchFile(hosts_file, {interval: options.watcher}, function()
{
	debug('Hosts file changed');
	parseHosts();
});

server.serve(options.server.port, options.server.host);

parseHosts();
