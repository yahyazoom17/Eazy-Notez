from fastapi import FastAPI
from pydantic import BaseModel
import json
from fastapi.middleware.cors import CORSMiddleware
import uuid

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,                # List of allowed origins
    allow_credentials=True,               # Allow cookies or authentication headers
    allow_methods=["*"],                  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],                  # Allow all headers
)


class NoteModel(BaseModel):
    note_id: str
    title: str
    description: str
    createdTime: str
    bookmark: bool

dup_notes = {
    "allnotes":[]
}

bookmarked_notes = []
fetched = False
def fetch_all_notes_from_storage():
    with open('notes.json', "r") as jsonfile:
        notes = json.load(jsonfile)
        dup_notes["allnotes"].extend(notes["allnotes"])
    print({"message":"All notes fetched!", "status":"success"})

def remove_duplicates(lst):
    result = []
    for item in lst:
        if item not in result:
            result.append(item)
    return result

def fetch_all_notes():
    dup_notes["allnotes"] = remove_duplicates(dup_notes["allnotes"])
    return {"message":"Fetched all notes successfully!", "total_notes": len(dup_notes["allnotes"]), "allnotes":dup_notes["allnotes"], "status":"success"}

def bookmark_note(note:dict):
    dnote = next((newnote for newnote in dup_notes["allnotes"] if newnote["note_id"] == note["note_id"]), None)
    dup_notes["allnotes"].remove(dnote)
    with open('notes.json', "r") as jsonfile:
        notes = json.load(jsonfile)
        allnotes = notes["allnotes"]
    anote = next((nnote for nnote in allnotes if nnote["note_id"] == note["note_id"]), None)
    if anote:
        return {"message":"Note is already saved!"}
    else:
        with open("notes.json", "w") as json_file:
            allnotes.append(note)
            json.dump({"allnotes":allnotes}, json_file, indent=4)
        fetch_all_notes_from_storage()
        return {"message":"Note saved successfully!"}
    '''
    if note in dup_notes["allnotes"]:
        try:
            if note["bookmark"] is False:
                note["bookmark"] = True
                bookmark_note.append(note)
                return {"message":"Note saved successfully!", "status":"success"}
            else:
                return {"message":"This note is already saved!", "status":"error"}   
        except Exception as e:
            return {"message":f"{e}", "status":"error"}
        finally:
            with open("notes.json", "w") as json_file:
                    json.dump({"allnotes":bookmarked_notes}, json_file, indent=4)
    else:
        return {"message":"Note does not exist!", "status":"error"}
    '''

def save_note(note:dict):
    note["note_id"] = str(uuid.uuid4())
    dup_notes["allnotes"].append(note)
    return {"message":"Note added successfully!", "status":"success"}

def update_note(note:dict):
    dnote = next((newnote for newnote in dup_notes["allnotes"] if newnote["note_id"] == note["note_id"]), None)
    with open('notes.json', "r") as jsonfile:
        notes = json.load(jsonfile)
        allnotes = notes["allnotes"]
    anote = next((nnote for nnote in allnotes if nnote["note_id"] == note["note_id"]), None)
    if dnote:
        dnote["title"] = note["title"]
        dnote["description"] = note["description"]
        dnote["createdTime"] = note["createdTime"]
        dnote["bookmark"] = note["bookmark"]
        note_index = dup_notes["allnotes"].index(dnote)
        dup_notes["allnotes"][note_index] = dnote
        return {"message":"Note updated successfully!", "status":"success"}
    elif anote:
        anote["title"] = note["title"]
        anote["description"] = note["description"]
        anote["createdTime"] = note["createdTime"]
        anote["bookmark"] = note["bookmark"]
        note_index = allnotes.index(anote)
        allnotes[note_index] = dnote
        with open("notes.json", "w") as json_file:
            allnotes.append(note)
            json.dump({"allnotes":allnotes}, json_file, indent=4)
        return {"message":"Note updated successfully!", "status":"success"}
    else:
        return {"message":"Note does not exist!", "status":"error"}
    
def remove_note(note_id):
    dnote = next((newnote for newnote in dup_notes["allnotes"] if newnote["note_id"] == note_id), None)
    with open('notes.json', "r") as jsonfile:
        notes = json.load(jsonfile)
        allnotes = notes["allnotes"]
    anote = next((nnote for nnote in allnotes if nnote["note_id"] == note_id), None)
    if anote:
        note_index = allnotes.index(anote)
        allnotes.remove(allnotes[note_index])
        with open("notes.json", "w") as json_file:
            json.dump({"allnotes": allnotes}, json_file, indent=4)
            fetch_all_notes_from_storage()
        return {"message":"Note deleted successfully!", "status":"success"}
    elif dnote:
        note_index = dup_notes["allnotes"].index(dnote)
        dup_notes["allnotes"].remove(dup_notes["allnotes"][note_index])
        return {"message":"Note deleted successfully!", "status":"success"}
    else:
        return {"message":"Note does not exist!", "status":"error"}

@app.on_event("startup")
async def on_startup():
    fetch_all_notes_from_storage()

@app.get("/")
def get_home():
    return {"message":"Notes-Taker API"}

@app.post("/addbookmark")
def add_bookmark(note : NoteModel):
    data = note.dict()
    result = bookmark_note(data)
    return result

@app.get("/allnotes")
def get_allnotes():
    result = fetch_all_notes()
    return result
    
@app.post("/addnote")
def create_note(note:NoteModel):
    data = note.dict() 
    result = save_note(data)
    return result

@app.put("/editnote")
def edit_note(note:NoteModel):
    data = note.dict()
    result = update_note(data)
    return result

@app.delete("/deletenote/{note_id}")
def delete_note(note_id):
    result = remove_note(note_id)
    return result