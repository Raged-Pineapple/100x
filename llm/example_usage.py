import json
from resume_matcher import rank_resumes_by_skills, save_ranked_resumes
from job import extract_fields

def main():
    # Load resumes
    with open('final_finale.json', 'r') as file:
        resumes = json.load(file)
    
    # Read job description from file
    with open('../test_job_input.txt', 'r') as file:
        job_description = file.read().strip()
    
    # Extract skills from job description
    job_fields = extract_fields(job_description)
    required_skills = job_fields.skills
    
    print(f"Ranking resumes based on {len(required_skills)} required skills:")
    for skill in required_skills:
        print(f"- {skill}")
    
    # Rank resumes by skills
    ranked_resumes = rank_resumes_by_skills(resumes, required_skills)
    
    # Save ranked resumes
    output_file = "ranked_resumes.json"
    save_ranked_resumes(ranked_resumes, output_file)
    
    # Display top matches
    print(f"\nTop 5 matching resumes out of {len(ranked_resumes)} total:")
    for i, resume in enumerate(ranked_resumes[:5], 1):
        name = resume['meta']['name'] or "Unnamed"
        position = resume['meta']['position'] or "Unknown position"
        print(f"{i}. {name} ({position}) - Match Score: {resume['match_score']}%")
        print(f"   Individual skill matches: {resume['skill_matches']}")
        print()

if __name__ == "__main__":
    main()
