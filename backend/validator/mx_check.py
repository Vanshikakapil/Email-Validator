import dns.resolver

def has_mx_record(domain: str) -> bool:
    try:
        answers = dns.resolver.resolve(domain, 'MX')
        return len(answers) > 0
    except Exception:
        return False
