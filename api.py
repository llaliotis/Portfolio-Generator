import openai

openai.api_key = 'OPENAI_API_KEY'

response = openai.Completion.create(
    model="gpt-3.5-turbo",
    prompt="Say hello!",
    max_tokens=5
)

print(response.choices[0].text.strip())
