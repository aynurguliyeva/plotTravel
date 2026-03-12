from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

MAX_BCRYPT_LENGTH = 72

def hash_password(password: str) -> str:
    # truncate password to 72 characters
    safe_password = password[:MAX_BCRYPT_LENGTH]
    return pwd_context.hash(safe_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password[:MAX_BCRYPT_LENGTH], hashed_password)