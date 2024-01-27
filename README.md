# BDSX-GitBackup  
  
## List of Features  
- Backup feature using Git.  
- GitHub Actions to release `.mcworld` on push
## How to use  
1. `git clone` to `plugins/` folder  
2. edit `config.ts`  
3. Start BDSX!!  

## Where is the `.git` folder?  
**A.** It is in `plugins/{this plugin folder}/backup` folder.  

## Notes
- Worlds that are large in size (over 2 GB) cannot be backed up.  
  - This is due to GitHub limitations at this stage.  
- If you are signing and logging into repositories interactively using the passkey in Git, please make the environment less interactive (commits and pushes can be done only with commands).  
  - Using SSH and a modern Git client to sign and push is most reliable and recommended.  
- This plugin is suitable for servers with a world size of ~200MB.  
  - Worlds that expand in size, such as survival servers, require time for network communication and registration with Git.  
- If you are using a private repository (no one will probably make the server world public), watch out for the execution time of the job in GitHub Actions.  
  - For a world of about 1.7 GB, it takes about 2 min to execute a job.  
- If an error (e.g. 403) occurs in the release job, Go to `Repository Settings -> Actions -> General -> Workflow permissions` and check `Read and write permissions`.  

## Credits & Thanks
- ZIP Library: PZIP
  - https://github.com/ybirader/pzip  
  - By far the fastest ZIPing is possible.  
