# wildcard-dns-proxy-thing

Allows the use of wildcards directly in /etc/hosts or %windir%\System32\drivers\etc\hosts.

These files will be watched for changes:

#### C:\Windows\System32\drivers\etc\hosts example

1.1.1.1		*.foot.com\
2.2.2.2		*.sack.com

#### /etc/hosts example

1.1.1.1	*.foot.com\
2.2.2.2	*.sack.com
