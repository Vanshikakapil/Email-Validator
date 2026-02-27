import bcrypt

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

admin_password = hash_password("Vanshi@123")

print("Admin bcrypt password:", admin_password)

