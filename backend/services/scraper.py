import requests
from bs4 import BeautifulSoup
import re

def scrape_recipe_page(url: str) -> str:
    \"\"\"
    Fetches a web page and extracts its textual content, stripped of scripts and styles.
    \"\"\"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script, style, header, footer, nav to reduce noise
        for element in soup(["script", "style", "nav", "header", "footer", "aside"]):
            element.extract()
            
        text = soup.get_text(separator=' ')
        
        # Clean up excessive whitespace
        text = re.sub(r'\\s+', ' ', text).strip()
        
        return text
    except Exception as e:
        raise Exception(f"Failed to scrape URL: {str(e)}")
