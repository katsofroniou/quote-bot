# Config
import dotenv
import os
import csv

# Discord
import discord

# Import database functions
from server import save_quote, delete_all_quote, delete_quote, create_quotes_table

# Load credentials
dotenv.load_dotenv()
TOKEN = str(os.getenv("DISCORD_TOKEN"))
QUOTE_DIR = '/quote-data'

bot = discord.Bot()