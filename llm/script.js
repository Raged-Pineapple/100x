document.addEventListener('DOMContentLoaded', () => {
    const jobDescription = document.getElementById('jobDescription');
    const extractJobBtn = document.getElementById('extractJobBtn');
    const jobFields = document.getElementById('jobFields');
    const jobTitle = document.getElementById('jobTitle');
    const jobSkills = document.getElementById('jobSkills');
    const jobExperience = document.getElementById('jobExperience');
    const jobLocation = document.getElementById('jobLocation');

    const resumeText = document.getElementById('resumeText');
    const analyzeResumeBtn = document.getElementById('analyzeResumeBtn');
    const resumeResults = document.getElementById('resumeResults');
    const matchScore = document.getElementById('matchScore');
    const skillsMatch = document.getElementById('skillsMatch');
    const experienceMatch = document.getElementById('experienceMatch');

    // Dummy data for different job titles
    const dummyJobData = {
        "Software Engineer": {
            "title": "Senior Software Engineer",
            "skills": ["Python", "JavaScript", "React", "Node.js", "SQL", "AWS", "Docker", "Kubernetes", "Agile", "REST APIs"],
            "experience": "5+ years of experience in full-stack development.",
            "location": "San Francisco, CA"
        },
        "Data Scientist": {
            "title": "Lead Data Scientist",
            "skills": ["Python", "R", "TensorFlow", "PyTorch", "SciPy", "Pandas", "NumPy", "Machine Learning", "Statistical Modeling", "Data Visualization", "Big Data"],
            "experience": "7+ years of experience in data science and machine learning.",
            "location": "New York, NY"
        },
        "Product Manager": {
            "title": "Senior Product Manager",
            "skills": ["Product Management", "Agile", "Scrum", "Market Research", "User Stories", "Roadmapping", "JIRA", "Customer Feedback", "Go-to-Market Strategy"],
            "experience": "6+ years of experience in product management.",
            "location": "Seattle, WA"
        },
        "UX/UI Designer": {
            "title": "Senior UX/UI Designer",
            "skills": ["Figma", "Sketch", "Adobe XD", "Wireframing", "Prototyping", "User Research", "Usability Testing", "Interaction Design", "Visual Design", "HTML", "CSS"],
            "experience": "4+ years of experience in UX/UI design.",
            "location": "Remote"
        },
        "Marketing Specialist": {
            "title": "Digital Marketing Specialist",
            "skills": ["SEO", "SEM", "Content Marketing", "Social Media Marketing", "Email Marketing", "Google Analytics", "Paid Advertising", "HubSpot"],
            "experience": "3+ years of experience in digital marketing.",
            "location": "Austin, TX"
        },
        "Default": {
            "title": "Job Title (Dummy)",
            "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5", "Skill 6", "Skill 7", "Skill 8"],
            "experience": "Required experience (Dummy)",
            "location": "Location (Dummy)"
        }
    };

    // Dummy resume analysis data
    const dummyResumeAnalysis = {
        "Software Engineer": {
            scores: {
                overall_score: 0.85,
                skills_match: 0.9,
                experience_match: 0.8
            },
            matching_skills: ["Python", "JavaScript", "React", "Node.js", "SQL", "AWS"],
            missing_skills: ["Kubernetes", "Docker"],
            experience_analysis: "Strong experience in full-stack development with 5+ years of relevant experience. Good match for the required experience level.",
            recommendations: "Consider gaining experience with containerization tools like Docker and Kubernetes to improve match."
        },
        "Data Scientist": {
            scores: {
                overall_score: 0.75,
                skills_match: 0.8,
                experience_match: 0.7
            },
            matching_skills: ["Python", "Machine Learning", "Statistical Modeling", "Data Visualization"],
            missing_skills: ["TensorFlow", "PyTorch", "Big Data"],
            experience_analysis: "Good experience in data science with 4+ years. Could benefit from more experience with deep learning frameworks.",
            recommendations: "Focus on gaining experience with deep learning frameworks and big data technologies."
        },
        "Product Manager": {
            scores: {
                overall_score: 0.65,
                skills_match: 0.7,
                experience_match: 0.6
            },
            matching_skills: ["Product Management", "Agile", "Market Research"],
            missing_skills: ["Roadmapping", "Go-to-Market Strategy"],
            experience_analysis: "Moderate experience in product management. Some gaps in strategic planning experience.",
            recommendations: "Develop skills in product roadmapping and go-to-market strategy."
        },
        "UX/UI Designer": {
            scores: {
                overall_score: 0.55,
                skills_match: 0.6,
                experience_match: 0.5
            },
            matching_skills: ["Figma", "Wireframing", "User Research"],
            missing_skills: ["Prototyping", "Interaction Design", "HTML/CSS"],
            experience_analysis: "Basic experience in UX design. Needs more experience with prototyping and front-end development.",
            recommendations: "Enhance prototyping skills and learn basic front-end development."
        },
        "Marketing Specialist": {
            scores: {
                overall_score: 0.45,
                skills_match: 0.5,
                experience_match: 0.4
            },
            matching_skills: ["Content Marketing", "Social Media Marketing"],
            missing_skills: ["SEO", "SEM", "Paid Advertising"],
            experience_analysis: "Limited experience in digital marketing. Needs more experience with paid advertising and analytics.",
            recommendations: "Focus on developing SEO/SEM skills and paid advertising experience."
        },
        "Default": {
            scores: {
                overall_score: 0.5,
                skills_match: 0.5,
                experience_match: 0.5
            },
            matching_skills: ["Skill 1", "Skill 2"],
            missing_skills: ["Skill 3", "Skill 4"],
            experience_analysis: "Basic match with the job requirements.",
            recommendations: "Continue developing relevant skills and gaining experience in the field."
        }
    };

    // Extract job fields using dummy data for demonstration
    extractJobBtn.addEventListener('click', async () => {
        // Clear previous results and hide the container before fetching
        jobTitle.textContent = '';
        jobSkills.innerHTML = '';
        jobExperience.textContent = '';
        jobLocation.textContent = '';
        // Keep jobFields visible due to CSS override for now
        // jobFields.classList.add('hidden'); // Commented out due to CSS override
         jobFields.style.display = 'none'; // Explicitly hide before new data

        const jobDescriptionText = jobDescription.value.toLowerCase(); // Convert to lowercase for easier matching

        let dataToDisplay = dummyJobData.Default; // Default to show something if no match

        // Check for keywords in the job description and use corresponding dummy data
        if (jobDescriptionText.includes('software engineer')) {
            dataToDisplay = dummyJobData["Software Engineer"];
        } else if (jobDescriptionText.includes('data scientist')) {
            dataToDisplay = dummyJobData["Data Scientist"];
        } else if (jobDescriptionText.includes('product manager')) {
            dataToDisplay = dummyJobData["Product Manager"];
        } else if (jobDescriptionText.includes('ux/ui designer') || jobDescriptionText.includes('user experience')) {
            dataToDisplay = dummyJobData["UX/UI Designer"];
        } else if (jobDescriptionText.includes('marketing specialist') || jobDescriptionText.includes('digital marketing')) {
            dataToDisplay = dummyJobData["Marketing Specialist"];
        }

        console.log('Using dummy data for display:', dataToDisplay); // Log which dummy data is used
        displayJobFields(dataToDisplay); // Call display function with dummy data

        // Fetch and display flow log after job extraction (dummy or actual)
        displayFlowLog();

        // The following backend fetch block is commented out for dummy data demonstration
        // try {
        //     const response = await fetch('/api/extract-job', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             job_description: jobDescriptionText
        //         })
        //     });

        //     if (!response.ok) {
        //         const errorText = await response.text();
        //         throw new Error(`Failed to extract job fields: ${response.status} ${response.statusText} - ${errorText}`);
        //     }

        //     const data = await response.json();
        //     console.log('Received data from backend:', data); // Log data for debugging
        //     displayJobFields(data);
        // } catch (error) {
        //     console.error('Error fetching job fields:', error);
        //     alert('Failed to extract job fields. Please check the console for details and ensure the backend is running.');
        //     // Keep the results container hidden on error
        //      jobFields.style.display = 'none'; // Ensure hidden on error
        // }
    });

    // Analyze resume using dummy data for demonstration
    analyzeResumeBtn.addEventListener('click', async () => {
        // Clear previous results and hide the container before fetching
        matchScore.textContent = '0';
        updateMatchBar(skillsMatch, 0);
        updateMatchBar(experienceMatch, 0);
        resumeResults.classList.add('hidden'); // Re-hide before new results

        const resumeTextValue = resumeText.value.toLowerCase(); // Convert to lowercase for easier matching
        const jobDescriptionText = jobDescription.value.toLowerCase(); // Need job description for analysis

        if (!resumeTextValue || !jobDescriptionText) {
            alert('Please enter both resume text and a job description.');
            return;
        }

        let analysisData = dummyResumeAnalysis.Default; // Default analysis data

        // Check for keywords in the job description to determine which analysis to show
        if (jobDescriptionText.includes('software engineer')) {
            analysisData = dummyResumeAnalysis["Software Engineer"];
        } else if (jobDescriptionText.includes('data scientist')) {
            analysisData = dummyResumeAnalysis["Data Scientist"];
        } else if (jobDescriptionText.includes('product manager')) {
            analysisData = dummyResumeAnalysis["Product Manager"];
        } else if (jobDescriptionText.includes('ux/ui designer') || jobDescriptionText.includes('user experience')) {
            analysisData = dummyResumeAnalysis["UX/UI Designer"];
        } else if (jobDescriptionText.includes('marketing specialist') || jobDescriptionText.includes('digital marketing')) {
            analysisData = dummyResumeAnalysis["Marketing Specialist"];
        }

        console.log('Using dummy analysis data:', analysisData); // Log which dummy data is used
        displayResumeAnalysis(analysisData); // Call display function with dummy data

        // Fetch and display flow log after job extraction (dummy or actual)
        displayFlowLog();

        // The following backend fetch block is commented out for dummy data demonstration
        // try {
        //     const response = await fetch('/api/analyze-resume', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             resume_text: resumeTextValue,
        //             job_description: jobDescriptionText
        //         })
        //     });

        //     if (!response.ok) {
        //         const errorText = await response.text();
        //         throw new Error(`Failed to analyze resume: ${response.status} ${response.statusText} - ${errorText}`);
        //     }

        //     const data = await response.json();
        //     console.log('Received analysis data from backend:', data); // Log data for debugging
        //     displayResumeAnalysis(data);
        // } catch (error) {
        //     console.error('Error analyzing resume:', error);
        //     alert('Failed to analyze resume. Please check the console for details and ensure the backend is running.');
        //     // Keep the results container hidden on error
        //     resumeResults.classList.add('hidden');
        // }
    });

    // Display extracted job fields
    function displayJobFields(data) {
        console.log('Attempting to display job fields with data:', data);
        
        // Ensure data and its properties exist before accessing
        jobTitle.textContent = data.title || 'N/A';
        console.log('Job Title set to:', jobTitle.textContent);

        jobExperience.textContent = data.experience || 'N/A';
         console.log('Job Experience set to:', jobExperience.textContent);

        jobLocation.textContent = data.location || 'N/A';
         console.log('Job Location set to:', jobLocation.textContent);

        // Clear and populate skills
        jobSkills.innerHTML = '';
        if (data.skills && Array.isArray(data.skills)) {
            console.log('Populating skills:', data.skills);
             data.skills.forEach(skill => {
                 const tag = document.createElement('span');
                 tag.className = 'tag';
                 tag.textContent = skill;
                 jobSkills.appendChild(tag);
                 console.log('Appended skill tag:', skill);
             });
        } else {
             jobSkills.textContent = 'No skills extracted';
             console.log('No skills array found or skills array is empty.');
        }

        // Only show if data is successfully populated
        if (data.title || (data.skills && data.skills.length > 0) || data.experience || data.location) {
            console.log('Data seems valid, attempting to show jobFields.');
            // Use style.display directly to ensure visibility
            jobFields.style.display = 'block'; // Set display to block
            jobFields.classList.remove('hidden'); // Still try to remove the class
            console.log('jobFields display style set to block.', jobFields.style.display);
             console.log('hidden class removed from jobFields.', jobFields.classList.contains('hidden'));
        } else {
             // If no data extracted, hide the container
             jobFields.style.display = 'none'; // Explicitly hide
             jobFields.classList.add('hidden'); // Add hidden class
             console.log('No job data extracted to display, hiding jobFields.');
        }
         console.log('Finished displayJobFields function.');
    }

    // Display resume analysis results
    function displayResumeAnalysis(data) {
        // Ensure data and scores property exist
        if (data.scores) {
            // Update match score
            const score = Math.round(data.scores.overall_score * 100) || 0;
            matchScore.textContent = score;

            // Update match status
            const matchStatus = document.getElementById('matchStatus');
            if (score >= 80) {
                matchStatus.textContent = 'Strong Match';
                matchStatus.className = 'status-success';
            } else if (score >= 60) {
                matchStatus.textContent = 'Good Match';
                matchStatus.className = 'status-warning';
            } else {
                matchStatus.textContent = 'Needs Improvement';
                matchStatus.className = 'status-error';
            }

            // Update analysis time
            document.getElementById('analysisTime').textContent = new Date().toLocaleTimeString();

            // Update match bars and percentages
            const skillsMatchPercent = Math.round(data.scores.skills_match * 100);
            const experienceMatchPercent = Math.round(data.scores.experience_match * 100);
            
            updateMatchBar(skillsMatch, data.scores.skills_match);
            updateMatchBar(experienceMatch, data.scores.experience_match);
            
            document.getElementById('skillsMatchPercent').textContent = `${skillsMatchPercent}%`;
            document.getElementById('experienceMatchPercent').textContent = `${experienceMatchPercent}%`;

            // Update skills match count
            const matchingSkillsCount = data.matching_skills ? data.matching_skills.length : 0;
            const totalSkills = (data.matching_skills ? data.matching_skills.length : 0) + 
                              (data.missing_skills ? data.missing_skills.length : 0);
            document.getElementById('skillsMatchCount').textContent = `${matchingSkillsCount}/${totalSkills} skills matched`;

            // Update experience match details
            document.getElementById('experienceMatchDetails').textContent = 
                data.experience_analysis || 'Experience analysis not available';

            // Update matching skills
            const matchingSkillsContainer = document.getElementById('matchingSkills');
            matchingSkillsContainer.innerHTML = '';
            if (data.matching_skills) {
                data.matching_skills.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.innerHTML = `<i class="fas fa-check"></i> ${skill}`;
                    matchingSkillsContainer.appendChild(tag);
                });
            }

            // Update missing skills
            const missingSkillsContainer = document.getElementById('missingSkills');
            missingSkillsContainer.innerHTML = '';
            if (data.missing_skills) {
                data.missing_skills.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'tag';
                    tag.innerHTML = `<i class="fas fa-times"></i> ${skill}`;
                    missingSkillsContainer.appendChild(tag);
                });
            }

            // Update experience analysis
            document.getElementById('experienceAnalysis').textContent = data.experience_analysis || '';

            // Update recommendations
            document.getElementById('recommendations').textContent = data.recommendations || '';

            // Show results with animation
            resumeResults.classList.remove('hidden');
            resumeResults.classList.add('fade-in');
        } else {
            // If scores data is missing, keep hidden or show a message
            resumeResults.classList.add('hidden');
            console.log('No analysis data received to display.');
        }
    }

    // Update match bar with animation
    function updateMatchBar(element, score) {
        const percentage = Math.round(score * 100);
        // Ensure the style property name is correct for the CSS variable
        element.style.setProperty('--match-percentage', `${percentage}%`);
        // Remove and re-add animate class to restart animation if needed
        element.classList.remove('animate');
        // Use a small timeout to ensure class is removed before re-adding
        setTimeout(() => {
             element.classList.add('animate');
        }, 10);
    }

    // Function to fetch and display flow_output.log
    async function displayFlowLog() {
        const flowLogContent = document.getElementById('flowLogContent');
        const flowLogSection = document.querySelector('.flow-log-section');
        
        // Show loading state
        flowLogContent.innerHTML = `
            <div class="flow-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading flow data...</span>
            </div>
        `;

        try {
            const response = await fetch('/api/flow-log');
            if (response.ok) {
                const logText = await response.text();
                
                // Process log text into structured steps
                const steps = processLogText(logText);

                // Create HTML for flow steps
                const flowContainer = document.createElement('div');
                flowContainer.className = 'flow-steps-container';

                if (steps.length > 0) {
                    steps.forEach((step, index) => {
                        const stepCard = document.createElement('div');
                        stepCard.className = 'flow-step-card';
                        
                        // Add step header (optional, based on log structure)
                        if (step.header) {
                            const stepHeader = document.createElement('div');
                            stepHeader.className = 'flow-step-header';
                            stepHeader.innerHTML = `
                                <div class="step-title">${step.header}</div>
                            `;
                            stepCard.appendChild(stepHeader);
                        }

                        const stepDetails = document.createElement('div');
                        stepDetails.className = 'flow-step-details';

                        // Add log lines for this step
                        const contentContainer = document.createElement('div');
                        contentContainer.className = 'step-content';

                        step.content.forEach(item => {
                             const itemElement = document.createElement('div');
                             itemElement.className = `content-item ${item.type || ''}`;

                             if (item.type === 'keyValue') {
                                  itemElement.innerHTML = `
                                       ${item.icon ? `<i class="fas ${item.icon}"></i>` : ''}
                                       <span class="item-key">${item.key}:</span>
                                       <span class="item-value">${item.value}</span>
                                       ${item.timestamp ? `<span class="log-timestamp">${item.timestamp}</span>` : ''}
                                  `;
                             } else if (item.type === 'list') {
                                  itemElement.innerHTML = `
                                       ${item.icon ? `<i class="fas ${item.icon}"></i>` : ''}
                                       <span class="item-key">${item.key}:</span>
                                       <span class="item-value-list">${item.values.map(val => `<span class="tag">${val}</span>`).join('')}</span>
                                        ${item.timestamp ? `<span class="log-timestamp">${item.timestamp}</span>` : ''}
                                  `;
                             } else if (item.type === 'json') {
                                  itemElement.innerHTML = `
                                       ${item.icon ? `<i class="fas ${item.icon}"></i>` : ''}
                                       <span class="item-key">${item.key}:</span>
                                       <pre class="item-json">${JSON.stringify(item.jsonData, null, 2)}</pre>
                                       ${item.timestamp ? `<span class="log-timestamp">${item.timestamp}</span>` : ''}
                                  `;
                             } else { // Default to message type
                                  itemElement.innerHTML = `
                                       ${item.icon ? `<i class="fas ${item.icon}"></i>` : ''}
                                       ${item.timestamp ? `<span class="log-timestamp">${item.timestamp}</span>` : ''}
                                       <span class="item-message">${item.text}</span>
                                  `;
                             }

                             contentContainer.appendChild(itemElement);
                        });
                        stepDetails.appendChild(contentContainer); // Append the content container to stepDetails

                        stepCard.appendChild(stepDetails);
                        flowContainer.appendChild(stepCard);

                        // Add connector if not the last step
                        if (index < steps.length - 1) {
                            const connector = document.createElement('div');
                            connector.className = 'flow-connector';
                            connector.innerHTML = '<i class="fas fa-chevron-down"></i>';
                            flowContainer.appendChild(connector);
                        }
                    });

                    flowLogContent.innerHTML = ''; // Clear loading message
                    flowLogContent.appendChild(flowContainer);
                    flowLogSection.classList.remove('hidden');

                } else {
                    // If no processable steps found
                    flowLogContent.innerHTML = `
                        <div class="flow-error">
                            <i class="fas fa-info-circle"></i>
                            <div class="error-message">
                                <h4>No Processable Log Data</h4>
                                <p>The log file did not contain recognized flow step entries.</p>
                                <pre class="raw-content">${logText}</pre>
                            </div>
                        </div>
                    `;
                     flowLogSection.classList.remove('hidden');
                }

            } else if (response.status === 404) {
                flowLogContent.innerHTML = `
                    <div class="flow-error">
                        <i class="fas fa-file-alt"></i>
                        <div class="error-message">
                            <h4>Flow Log Not Found</h4>
                            <p>The flow log file could not be found on the server.</p>
                        </div>
                    </div>
                `;
                flowLogSection.classList.remove('hidden');
            } else {
                flowLogContent.innerHTML = `
                    <div class="flow-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <div class="error-message">
                            <h4>Error Loading Flow Log</h4>
                            <p>Failed to load the flow log file: ${response.status} ${response.statusText}</p>
                        </div>
                    </div>
                `;
                flowLogSection.classList.remove('hidden');
            }
        } catch (error) {
            flowLogContent.innerHTML = `
                <div class="flow-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <div class="error-message">
                        <h4>Error Fetching Flow Log</h4>
                        <p>${error.message}</p>
                    </div>
                </div>
            `;
            flowLogSection.classList.remove('hidden');
        }
    }

    // Helper function to process raw log text into structured steps
    function processLogText(logText) {
        const steps = [];
        let currentStep = null;
        const lines = logText.split('\n');

        lines.forEach(line => {
            const stepHeaderMatch = line.match(/^(Step \d+:.*)/);

            if (stepHeaderMatch) {
                // If a line starts with "Step X:", it's a new step header
                if (currentStep) {
                    steps.push(currentStep);
                }
                currentStep = {
                    header: stepHeaderMatch[1].trim(),
                    content: [] // Use a single content array for mixed types
                };
            } else if (currentStep) {
                // If it's not a step header and we are in a current step, process the line content
                 const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
                 let timestamp = timestampMatch ? timestampMatch[1] : '';
                 let text = timestampMatch ? line.slice(timestampMatch[0].length).trim() : line.trim();

                // Try to parse as key-value or list
                const keyValueMatch = text.match(/^([^:]+):\s*(.*)$/);
                const listMatch = text.match(/^([^:]+):\s*\[(.*)\]$/);

                let item = { timestamp, originalText: line, type: 'message', text, icon: 'fa-circle-notch' }; // Default to message type

                if (listMatch) {
                     item.type = 'list';
                     item.key = listMatch[1].trim();
                     item.values = listMatch[2].split(',').map(v => v.trim().replace(/^['"]|['"]$/g, '')).filter(v => v !== '');
                     item.icon = 'fa-list-ul';
                     item.text = ''; // Clear text for structured display
                } else if (keyValueMatch) {
                     item.type = 'keyValue';
                     item.key = keyValueMatch[1].trim();
                     item.value = keyValueMatch[2].trim();

                     // Special handling for potential JSON embedded in value
                     if (item.key === 'Results' && item.value.startsWith('{') && item.value.endsWith('}')) {
                          try {
                                item.type = 'json';
                                item.jsonData = JSON.parse(item.value);
                                item.icon = 'fa-code';
                                item.value = ''; // Clear value for JSON display
                          } catch (e) {
                                console.error('Failed to parse JSON in log line:', e, line);
                                // Fallback to key-value if JSON parsing fails
                                item.type = 'keyValue';
                                item.value = keyValueMatch[2].trim();
                                item.icon = 'fa-circle-notch';
                          }
                     } else {
                          item.icon = 'fa-caret-right'; // Default icon for key-value
                     }
                     item.text = ''; // Clear text for structured display
                } else if (text.includes('ERROR') || text.includes('Error')) {
                    item.type = 'error';
                    item.icon = 'fa-exclamation-circle';
                } else if (text.includes('WARNING') || text.includes('Warning')) {
                    item.type = 'warning';
                    item.icon = 'fa-exclamation-triangle';
                } else if (text.includes('INFO') || text.includes('Info')) {
                     item.type = 'info';
                     item.icon = 'fa-info-circle';
                } else if (text.includes('SUCCESS') || text.includes('Success')) {
                     item.type = 'success';
                     item.icon = 'fa-check-circle';
                } else if (line.trim() === '') {
                    // Skip empty lines
                    return; // continue to the next line
                }

                currentStep.content.push(item);
            } else if (line.trim() !== '') {
                 // Content before the first step header
                 if (!steps.length && !currentStep) {
                      currentStep = {
                          header: 'Initialization', // Default header
                          content: []
                      };
                 }
                 if (currentStep) { // Add line to initialization step
                     const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
                     let timestamp = timestampMatch ? timestampMatch[1] : '';
                     let text = timestampMatch ? line.slice(timestampMatch[0].length).trim() : line.trim();

                      let item = { timestamp, originalText: line, type: 'message', text, icon: 'fa-circle-notch' };

                      if (text.includes('ERROR') || text.includes('Error')) {
                         item.type = 'error';
                         item.icon = 'fa-exclamation-circle';
                      } else if (text.includes('WARNING') || text.includes('Warning')) {
                         item.type = 'warning';
                         item.icon = 'fa-exclamation-triangle';
                      } else if (text.includes('INFO') || text.includes('Info')) {
                           item.type = 'info';
                           item.icon = 'fa-info-circle';
                      } else if (text.includes('SUCCESS') || text.includes('Success')) {
                           item.type = 'success';
                           item.icon = 'fa-check-circle';
                      }

                      if (line.trim() !== '') {
                         currentStep.content.push(item);
                      }
                 }
            }
        });

        // Push the last step
        if (currentStep) {
            steps.push(currentStep);
        }

        return steps;
    }

    // Helper function to get status icon
    function getStatusIcon(status) {
        switch (status?.toLowerCase()) {
            case 'success':
                return 'fa-check-circle';
            case 'error':
                return 'fa-times-circle';
            case 'warning':
                return 'fa-exclamation-circle';
            case 'in_progress':
                return 'fa-spinner fa-spin';
            default:
                return 'fa-circle';
        }
    }

    // Helper function to format data for display
    function formatData(data) {
        if (typeof data === 'object') {
            return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
        return `<pre>${data}</pre>`;
    }

    // Helper function to create a step card
    function createStepCard(step, index) {
        const stepCard = document.createElement('div');
        stepCard.className = 'flow-step-card';
        
        const stepHeader = document.createElement('div');
        stepHeader.className = 'flow-step-header';
        stepHeader.innerHTML = `
            <div class="step-number">${index + 1}</div>
            <div class="step-title">${step.name || 'Step ' + (index + 1)}</div>
            <div class="step-status ${step.status?.toLowerCase() || 'pending'}">
                <i class="fas ${getStatusIcon(step.status)}"></i>
                ${step.status || 'Pending'}
            </div>
        `;
        
        stepCard.appendChild(stepHeader);
        return stepCard;
    }

    // Call displayFlowLog when the page loads
    // document.addEventListener('DOMContentLoaded', displayFlowLog); // Commented out
}); 