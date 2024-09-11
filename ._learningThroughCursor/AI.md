
1. have ai write prompts for you
  use artifacts
  never write partial files

2. between each prompt, commit to feature branch
  - automatically write to learning branch
3. if make changes to file, add to prompt to update file

4. if stuck in loop, try to exit through change. AI hallucinations happen.
  changing previous prompt to use different functions or 
  cite where code suggestion are coming from
  sometimes AI will infer that you are trying to do something, but you are not
  sometimes AI uses wrong function
  sometimes AI will make up a function
  sometimes AI is just wrong
  sometimes AI is not doing what you think it is

5. in claude create different chats to jump betweem so don't get rate limited When
   conversation gets too long and context length is exceeded.
   Spin up new chat as fast as possible to not eat up token credits otherwise will get timed out.





Claude Coding: https://github.com/anthropics/anthropic-cookbook?tab=readme-ov-file




3 step strategy for claude development
https://www.youtube.com/watch?v=fMa2zQIkQwM


  if want Claude to understand project, then upload repo  and u to 5 diagrams or drawings
  use xml 


   phase 1: find northstar for project (high level goals) - place in knowledge base
    - draw diagrams to explain project (up to 5) 
    - use use cases to explain project
    - use user stories to explain project
   phase 2: stub out Project v0 files. create files and descriptions of them  - place in knowledge based
   phase 3: create a chat for each file, one by one - create artifacts for each file in each chat
  
  https://www.reddit.com/r/ClaudeAI/comments/1f0ya1t/i_used_claude_to_write_an_sop_for_using_claude/
  
