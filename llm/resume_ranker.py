import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import os
from job import extract_fields
from schema import JobDescription
from typing import List, Dict, Any

def load_resumes(file_path: str) -> List[Dict[str, Any]]:
    """Load resume data from JSON file."""
    with open(file_path, 'r') as file:
        return json.load(file)

def embed_skills(skills: List[str], embedding_function=None) -> np.ndarray:
    """
    Convert skills to embedding vectors.
    
    In a real implementation, you would use the same embedding model 
    that was used to generate the resume vectors.
    
    Args:
        skills: List of skill terms or phrases
        embedding_function: Function to convert text to embeddings
        
    Returns:
        Numpy array of skill embeddings
    """
    if embedding_function:
        # Use the provided embedding function to convert skills to vectors
        return np.array([embedding_function(skill) for skill in skills])
    else:
        # For demonstration purposes, we'll create a simple embedding
        # This is a placeholder - in a real implementation, you would use the same embedding model
        print(f"Creating embeddings for skills: {skills}")
        
        # Get the dimension of resume embeddings from the first resume
        sample_resumes = load_resumes("final_finale.json")
        if sample_resumes:
            embedding_dim = len(sample_resumes[0]["embedding_vector"])
            print(f"Using embedding dimension: {embedding_dim}")
            
            # Instead of random embeddings, we'll use a more meaningful approach
            # We'll find resumes that likely contain each skill and use their embeddings as a reference
            skill_embeddings = []
            
            for skill in skills:
                # Find resumes that might contain this skill (based on position or other metadata)
                skill_related_resumes = []
                skill_lower = skill.lower()
                
                # Look for skill in position or other metadata
                for resume in sample_resumes:
                    position = resume["meta"].get("position", "")
                    # Check if position is not None before calling lower()
                    if position is not None:
                        position = position.lower()
                        if skill_lower in position:
                            skill_related_resumes.append(resume)
                
                # If we found related resumes, average their embeddings
                if skill_related_resumes:
                    avg_embedding = np.mean([r["embedding_vector"] for r in skill_related_resumes], axis=0)
                    skill_embeddings.append(avg_embedding)
                else:
                    # If no related resumes found, use a synthetic embedding
                    # We'll use the average of all resume embeddings and add some noise
                    avg_all = np.mean([r["embedding_vector"] for r in sample_resumes[:10]], axis=0)
                    noise = np.random.normal(0, 0.01, embedding_dim)
                    skill_embeddings.append(avg_all + noise)
            
            return np.array(skill_embeddings)
        else:
            raise ValueError("No resumes found to determine embedding dimension")

def compute_similarity(resume_vector: List[float], skill_vectors: np.ndarray, skills: List[str]) -> Dict[str, Any]:
    """
    Compute cosine similarity between a resume vector and skill vectors.
    
    Args:
        resume_vector: Embedding vector of a resume
        skill_vectors: Embedding vectors of skills
        skills: List of skill names corresponding to skill_vectors
        
    Returns:
        Dictionary with skill match scores and total average score
    """
    resume_vector = np.array(resume_vector).reshape(1, -1)
    
    # Calculate cosine similarity for each skill
    similarities = {}
    total_similarity = 0
    weights = []
    
    for i, (skill_vector, skill_name) in enumerate(zip(skill_vectors, skills)):
        skill_vector = skill_vector.reshape(1, -1)
        sim = cosine_similarity(resume_vector, skill_vector)[0][0]
        
        # Scale the similarity to a more meaningful range
        # Cosine similarity is between -1 and 1, with values typically clustered
        # We'll apply a scaling function to spread out the values
        
        # First, ensure the similarity is between 0 and 1
        sim = max(0, sim)
        
        # Apply a scaling function to get a more meaningful percentage
        # This will give higher percentages for even moderate similarities
        scaled_sim = np.sqrt(sim) * 100  # Square root scaling spreads out lower values
        
        # Ensure it's between 0 and 100
        percentage = max(0, min(100, scaled_sim))
        
        # Store the similarity with the actual skill name
        similarities[skill_name] = round(percentage, 1)
        
        # Add to total with importance weighting
        # Primary skills get higher weight
        weight = 1.0  # Default weight
        weights.append(weight)
        total_similarity += percentage * weight
    
    # Calculate weighted average similarity
    avg_similarity = total_similarity / sum(weights) if weights else 0
    
    return {
        "skill_matches": similarities,
        "match_score": round(avg_similarity, 1)
    }

def rank_resumes_by_skills(resumes: List[Dict[str, Any]], skills: List[str], embedding_function=None) -> List[Dict[str, Any]]:
    """
    Rank resumes based on their match with required skills.
    
    Args:
        resumes: List of resume dictionaries
        skills: List of required skills
        embedding_function: Function to convert text to embeddings
        
    Returns:
        List of ranked resumes with match scores
    """
    # Embed skills
    skill_vectors = embed_skills(skills, embedding_function)
    
    # Calculate match scores for each resume
    ranked_resumes = []
    
    for resume in resumes:
        resume_vector = resume["embedding_vector"]
        similarity_results = compute_similarity(resume_vector, skill_vectors, skills)
        
        ranked_resume = {
            "unique_id": resume["unique_id"],
            "match_score": similarity_results["match_score"],
            "skill_matches": similarity_results["skill_matches"],
            "meta": resume["meta"]
        }
        
        ranked_resumes.append(ranked_resume)
    
    # Sort resumes by match score (descending)
    ranked_resumes.sort(key=lambda x: x["match_score"], reverse=True)
    
    return ranked_resumes

def save_ranked_resumes(ranked_resumes: List[Dict[str, Any]], output_file: str) -> None:
    """Save ranked resumes to a JSON file."""
    with open(output_file, 'w') as file:
        json.dump(ranked_resumes, file, indent=2)

def main():
    """
    Main function to process resumes and rank them by skill match.
    
    Reads job description from test_job_input.txt, extracts skills,
    and ranks resumes based on their match with the required skills.
    """
    # Open a log file for writing output
    with open("resume_ranking.log", "w") as log_file:
        try:
            log_file.write("Starting resume ranking workflow\n")
            
            # Read job description
            with open("../test_job_input.txt") as f:
                job_desc = f.read().strip()
            log_file.write(f"Job description: '{job_desc}'\n")
            
            if not job_desc:
                raise ValueError("Empty job description file")

            # Extract job fields to get required skills
            job_fields = extract_fields(job_desc)
            if not job_fields:
                raise ValueError("Failed to extract job fields")
            
            skills = job_fields.skills
            log_file.write(f"Extracted skills: {skills}\n")
            
            # Load resumes from JSON file
            resumes = load_resumes("final_finale.json")
            log_file.write(f"Loaded {len(resumes)} resumes\n")
            
            # Rank resumes by skills
            ranked_resumes = rank_resumes_by_skills(resumes, skills)
            log_file.write(f"Ranked {len(ranked_resumes)} resumes\n")
            
            # Save ranked resumes
            output_file = "ranked_resumes.json"
            save_ranked_resumes(ranked_resumes, output_file)
            log_file.write(f"Saved ranked resumes to {output_file}\n")
            
            # Display top matches
            log_file.write("\nTop 5 matching resumes:\n")
            for i, resume in enumerate(ranked_resumes[:5], 1):
                name = resume['meta']['name'] or "Unnamed"
                position = resume['meta']['position'] or "Unknown position"
                log_file.write(f"{i}. {name} ({position}) - Match Score: {resume['match_score']}%\n")
                log_file.write(f"   Individual skill matches: {resume['skill_matches']}\n\n")
            
            # Print to console for confirmation
            print(f"Resume ranking completed successfully. Ranked {len(ranked_resumes)} resumes.")
            print(f"Top 5 matching resumes:")
            for i, resume in enumerate(ranked_resumes[:5], 1):
                name = resume['meta']['name'] or "Unnamed"
                position = resume['meta']['position'] or "Unknown position"
                print(f"{i}. {name} ({position}) - Match Score: {resume['match_score']}%")
            
            print("\nSee resume_ranking.log for detailed results.")
            print(f"Full results saved to {output_file}")
            
        except Exception as e:
            error_msg = f"Error in resume ranking: {str(e)}"
            log_file.write(error_msg + "\n")
            print(error_msg)

if __name__ == "__main__":
    main()
