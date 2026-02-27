import smtplib
import dns.resolver
import socket

def verify_smtp(email: str) -> bool:
    try:
        domain = email.split('@')[1]
        records = dns.resolver.resolve(domain, 'MX')
        mx_record = str(records[0].exchange)

        server = smtplib.SMTP(timeout=10)
        server.connect(mx_record)
        server.helo()
        server.mail('check@example.com')
        code, _ = server.rcpt(email)
        server.quit()

        return code == 250
    except Exception:
        return False
