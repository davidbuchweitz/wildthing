# wildcard-dns-proxy-thing

Allows the use of wildcards directly in /etc/hosts or %windir%\System32\drivers\etc\hosts.

These files will be watched for changes:

## C:\Windows\System32\drivers\etc\hosts example
1.1.1.1		*.whatevs.com
2.2.2.2		*.angel.com

## /etc/hosts example
1.1.1.1	*.whatevs.com blah
2.2.2.2	*.angel.com angel
