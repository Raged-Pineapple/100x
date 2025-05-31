### schema.py
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class EducationEntry(BaseModel):
    degree: str
    field: str
    institution: str
    start_year: Optional[int]
    end_year: Optional[int]

class ExperienceEntry(BaseModel):
    title: str
    company: str
    start_year: Optional[int]
    end_year: Optional[int]
    description: Optional[str]

class LanguageEntry(BaseModel):
    name: str
    level: str

class Resume(BaseModel):
    resume_id: str
    category: str
    raw_text: str
    parsed: Dict[str, Any]
    scores: Optional[Dict[str, float]] = None
    embedding: Optional[List[float]] = None
    meta: Optional[Dict[str, Any]] = None

class JobDescription(BaseModel):
    title: str
    skills: List[str]
    experience: str
    location: str
