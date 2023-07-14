from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database connection
engine = create_engine("sqlite:///quotes.db")
Base = declarative_base()
Session = sessionmaker(bind=engine)

# Defines table for quotes
class Quote(Base):
    __tablename__ = "quotes"
    id = Column(Integer, primary_key=True, autoincrement=True)
    author = Column(String)
    content = Column(String)

# Saves quotes to db
def save_quote(quote):
    session = Session()
    session.add(quote)
    session.commit()
    
# Deletes single quote
def delete_quote(quote):
    session = Session()
    session.delete(quote)
    session.commit()
    
# Deletes all quotes
def delete_all_quote():
    session = Session()
    session.query(Quote).delete()
    session.commit()
    
# Creates table if it doesn't already exist
def create_quotes_table():
    if not engine.dialect.has_table(engine, "quotes"):
        Base.metadata.create_all(engine)