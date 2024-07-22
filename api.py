import openai

openai.api_key = 'sk-proj-FFifgCnpo7S2td9yw1cNT3BlbkFJ1lmyM3HV3JIYRoEp76eM'

response = openai.Completion.create(
    model="gpt-3.5-turbo",
    prompt="Say hello!",
    max_tokens=5
)

print(response.choices[0].text.strip())
