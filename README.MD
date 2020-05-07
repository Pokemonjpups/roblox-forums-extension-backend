# Roblox Forums Backend
Used by the Roblox Forums project on forums.beak.dev

Please report any security vulnerabilities to forums-project@beak.dev

# Setup
1. Install MySQL and Node >= v12
2. Run `npm install`
3. Create a database, then create a file called "config.json" in the root directory (same directory as this README file). Copy the contents of "config.example.json" but replace certain vars with your variables. For `jwt => login` and `jwt => session`, you will need to generate two random keys to use. I use a random password generator but you can use whatever, just make sure they are super complicated so that nobody compromises your sessions.
4. You now have a few choices depending on your needs...
 - If you want to import the entire forums archive, download the ZIP file from Google Drive [here](https://drive.google.com/file/d/1rR7HXPXvLr654UHgRB_l7z95sJm7J68d/view?usp=sharing) and import it into the database (requires about 100GB of storage).
 - If you don't want to download the entire database, you can just skip this step
5. Run `npx knex migrate:latest` (this may take a long time depending on how far behind the forums archive is).
6. Run `npm run start:dev` to start the dev env (available on port 3000) or `npm run start` to start the production env (again, on port 3000)