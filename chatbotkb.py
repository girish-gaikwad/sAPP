# from llama_index import SimpleDirectoryReader, GPTListIndex, GPTVectorStoreIndex, LLMPredictor, PromptHelper,StorageContext, load_index_from_storage
# from langchain import OpenAI
# import sys
# import json
# import os
# import openai
# from llama_index import ServiceContext
# import backoff

# from dotenv import load_dotenv

# load_dotenv()

# openai.api_key = os.getenv("OPENAI_API_KEY")

# def create_Index(path):
#     max_input = 4096
#     tokens = 100
#     chuck_size = 1000
#     max_chunk_overlap = 0.2

#     promptHelper = PromptHelper(max_input, tokens, max_chunk_overlap, chunk_size_limit=chuck_size)

#     #define LLM 
#     llmPredictor = LLMPredictor(llm=OpenAI(temperature=0.7, model_name="text-ada-003",max_tokens=tokens))

#     #load data
#     docs = SimpleDirectoryReader(path).load_data()

#     #create vector index

#     service_context = ServiceContext.from_defaults(llm_predictor=llmPredictor,prompt_helper=promptHelper)
#     # vectorIndex = GPTVectorStoreIndex.from_documents(docs)
#     vectorIndex = GPTVectorStoreIndex.from_documents(docs,service_context=service_context)
#     # vectorIndex = GPTVectorStoreIndex(docs)
#     # vectorIndex
#     # vectorIndex.save_to_disk("vactorIndex.json")
#     vectorIndex.storage_context.persist(persist_dir = 'Store')
#     return vectorIndex

# # create_Index()

# @backoff.on_exception(backoff.expo, openai.error.RateLimitError)  # Decorate with backoff
# def answerMe(question):
#     try:
#         # create_Index("/Volumes/Transcend/Development/Depresio/ml_models/Chatbot/Knowledge")

#         # get query
#         # storage_context = StorageContext.from_defaults(persist_dir = '/usr/src/app/ml_models/Chatbot/Store')
#         storage_context = StorageContext.from_defaults(persist_dir = '../backend/ml_models/Chatbot/Store')
#         index = load_index_from_storage(storage_context)

#         query_engine = index.as_query_engine()
#         response = query_engine.query(question)

#         # data = response.data
#         # data_dict = data.to_dict()
#         response = str(response)

#         output = {"result": response}

#         output_json = json.dumps(output)
#         print(output_json)
#         # print(output)
#         # print(response)
#         sys.stdout.flush()
#         return response
#     except openai.error.OpenAIError as oe:
#         print(f"OpenAI error: {oe}")
#     except Exception as e:
#         error_message = str(e)
#         output = {"error2011": error_message}

#         output_json = json.dumps(output)
#         print(output_json)
#         sys.stdout.flush()
#         # return error_message


# if __name__ == '__main__':
#     # Read the input from command line arguments
#     input = sys.argv[1]
    
#     # Call the main function with the input
#     answerMe(input)
#     # print(answerMe("i'm sleepy right now"))

    
    # Install necessary libraries




# !pip install transformers
# !pip install torch

from transformers import pipeline, Conversation, AutoTokenizer, AutoModelForSequenceClassification
import random
# import torch

# Load the conversational model
chatbot = pipeline('conversational', model='microsoft/DialoGPT-medium', pad_token_id=50256)

# Load the sentiment-analysis pipeline
tokenizer = AutoTokenizer.from_pretrained("j-hartmann/emotion-english-distilroberta-base")
model = AutoModelForSequenceClassification.from_pretrained("j-hartmann/emotion-english-distilroberta-base")

# Define resources for each emotion
resources = {
    "joy": [
        "That's awesome! Check out this inspiring TED talk: [TED Talk](https://www.ted.com/talks)",
        "Glad you're feeling joyful! Maybe you'll enjoy this happy song: [Song](https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
        "Keep smiling! How about watching this feel-good movie: [Movie](https://www.imdb.com/title/tt0114709/)",
        # Add more resources as needed...
    ],
    "sadness": [
        "I'm sorry to hear that. Perhaps some calming music might help: [Calming Music](https://www.youtube.com/watch?v=2OEL4P1Rz04)",
        "It’s okay to feel sad. Maybe try this guided meditation: [Meditation](https://www.youtube.com/watch?v=inpok4MKVLM)",
        "Take a deep breath. Here's a list of uplifting movies: [Movies](https://www.imdb.com/list/ls052198382/)",
        # Add more resources as needed...
    ],
    "anger": [
        "Take a moment to calm down with this relaxing video: [Relaxing Video](https://www.youtube.com/watch?v=z6X5oEIg6Ak)",
        "Deep breaths can help. Try this yoga session: [Yoga](https://www.youtube.com/watch?v=v7AYKMP6rOE)",
        "It’s okay to feel angry. Maybe a workout will help: [Workout](https://www.youtube.com/watch?v=ml6cT4AZdqI)",
        # Add more resources as needed...
    ],
    "fear": [
        "Everything will be okay. Maybe this mindfulness exercise can help: [Mindfulness](https://www.youtube.com/watch?v=ZToicYcHIOU)",
        "Try focusing on positive thoughts. This video might help: [Positive Thoughts](https://www.youtube.com/watch?v=sTJ7AzBIJoI)",
        "You’re stronger than you think. Try this motivational video: [Motivational Video](https://www.youtube.com/watch?v=mgmVOuLgFB0)",
        # Add more resources as needed...
    ],
    "surprise": [
        "Wow! That sounds exciting! Maybe you'll enjoy this surprise video: [Surprise Video](https://www.youtube.com/watch?v=QH2-TGUlwu4)",
        "What a surprise! Here’s something fun to watch: [Fun Video](https://www.youtube.com/watch?v=3GwjfUFyY6M)",
        "Unexpected things can be fun! Check out this interesting talk: [Interesting Talk](https://www.ted.com/talks)",
        # Add more resources as needed...
    ]
}

def get_random_resource(emotion):
    if emotion in resources:
        return random.choice(resources[emotion])
    else:
        return "I'm here for you. How can I assist you today?"

def get_emotion_and_resource(text):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    outputs = model(**inputs)
    predicted_class_idx = torch.argmax(outputs.logits)
    emotion = model.config.id2label[predicted_class_idx.item()]

    # Debugging output to verify detected emotion
    print(f"Detected emotion: {emotion}")

    resource = get_random_resource(emotion)
    return emotion, resource

def chat_with_bot():
    print("Start chatting with the bot (type 'quit' to stop)!")
    conversation = Conversation()

    while True:
        user_input = input("User: ")
        if user_input.lower() == 'quit':
            break

        conversation.add_user_input(user_input)
        emotion, resource = get_emotion_and_resource(user_input)
        if emotion in ["sadness", "anger", "fear", "surprise", "joy"]:
            print(f"Bot: It seems you're feeling {emotion}. Here's a resource that might help: {resource}")
        else:
            chatbot_response = chatbot(conversation)
            print(f"Bot: {chatbot_response.generated_responses[-1]}")

chat_with_bot()




