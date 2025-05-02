import streamlit as st
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import google.generativeai as genai
from langchain.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import asyncio

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    if not GOOGLE_API_KEY:
        st.warning("Google API Key not set. Skipping vector store creation.")
        return
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")

def get_conversational_chain():
    prompt_template = """
    Answer the question as \n
    Context:\n {context}\n
    Question: \n{question}\n
    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

async def user_input(user_question):
    if not GOOGLE_API_KEY:
        st.info("API Key not found. Showing dummy response.")
        st.write("Reply: This is a placeholder answer for your question.")
        return
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)
    chain = get_conversational_chain()
    response = await chain.arun({"input_documents": docs, "question": user_question})
    st.write("Reply: ", response)

async def main():
    st.set_page_config("JUDGE")
    st.header("UPLOAD YOUR CASE")

    user_question = st.text_input("GET DETAILS")

    if user_question:
        await user_input(user_question)

    with st.sidebar:
        st.title("Menu:")
        pdf_docs = st.file_uploader("Upload your PDF Files and Click on the Submit & Process Button", accept_multiple_files=True)
        if st.button("Submit & Process"):
            with st.spinner("Processing..."):
                raw_text = get_pdf_text(pdf_docs)
                text_chunks = get_text_chunks(raw_text)
                get_vector_store(text_chunks)
                st.success("Done")

    st.markdown("---")
    st.header("Bail Decision")

    # Add custom CSS for background, glassmorphism effect, and button styling
    st.markdown("""
    <style>
        .stApp {
            background-color: #f0faff; /* Lightest blue background */
            color: black;
        }
        .glass {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .approve-btn, .not-approve-btn {
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
            border: none;
        }
        .approve-btn {
            background-color: green;
            color: white;
        }
        .not-approve-btn {
            background-color: red;
            color: white;
        }
        .button-container {
            display: flex;
            justify-content: center;
            gap: 20px;
        }
    </style>
    """, unsafe_allow_html=True)

    # Create a div for the glassmorphism effect
    with st.container():
        st.markdown('<div class="glass">', unsafe_allow_html=True)

        col1, col2 = st.columns(2)

        with col1:
            if st.button("Approve Bail", key="approve_bail"):
                st.markdown("<p style='color:green; font-size:20px;'>Bail Approved</p>", unsafe_allow_html=True)

        with col2:
            if st.button("Not Approve Bail", key="not_approve_bail"):
                st.markdown("<p style='color:red; font-size:20px;'>Bail Not Approved</p>", unsafe_allow_html=True)

        st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    asyncio.run(main())
