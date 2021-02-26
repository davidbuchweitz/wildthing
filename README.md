# wildthing

Allows the use of wildcards directly in `/etc/hosts` or `%windir%\System32\drivers\etc\hosts`.

The server will reload its records when it detects changes in the hosts file.

#### C:\Windows\System32\drivers\etc\hosts example

1.1.1.1		*.foot.com\
2.2.2.2		*.sack.com

#### /etc/hosts example

1.1.1.1	*.foot.com\
2.2.2.2	*.sack.com
