Instructions for hosting the web application locally:

1.	Unzip Unimeetup.zip. The web application consists of two main directories:
•	client: the React.js front-end of the project
•	server: the Node.js back-end of the project

3.	In your IDE, click File -> Open and open the unzipped Unimeetup folder that contains the client and server directories.

4.	This is what the file structure looks like in the IDE:

![image](https://github.com/rtgeorgiev/UniMeetUp/assets/68688306/a695b84d-4e96-4564-9858-55ce054400c8)

5.	Make sure you have Node.js and npm installed. Npm (node package manager) is required to install project dependencies. 
https://nodejs.org/en 
You can check if you have them by executing:
node -v
npm -v

6.	Open two separate terminal windows. 

7.	In the first terminal window, navigate to the client directory using cd client and execute npm install. This will install the dependencies required to run the client.

![image](https://github.com/rtgeorgiev/UniMeetUp/assets/68688306/f3bfd6e7-40f5-412f-b4dc-7cdcdd1b70c4)

8.	In the second terminal window, navigate to the server directory using cd server and execute npm install. This will install the dependencies required to run the server.

![image](https://github.com/rtgeorgiev/UniMeetUp/assets/68688306/aa7fba7e-7b04-4298-a9c9-9feb77b7c02f)

9.	After installing the dependencies, execute npm run start:frontend in the client directory (first terminal window). This will start the frontend.

10.	Then, execute npm run start:backend in the server directory (second terminal window). This will start the backend.

11.	Once you have successfully started the client and server, you will be able to access the website at: http://localhost:3000/

Main features summary:

•	Authentication:
Register / Log in. The web application only accepts valid university email addresses (emails with a .ac.uk suffix) for registration. This is because the web application is designed for students. If you want to register with an email other than a @.ac.uk one, you can comment out line 89 in client/src/components/Auth.js (this is the code that sets the email pattern) when hosting it locally.

•	Email verification:
When registering, you will receive a verification email.

•	User profiles:
The user profiles feature allows you to edit your profile details. Once logged in, you can click on your profile photo on the dashboard to access it.

•	Explore student profiles and match:
In the dashboard you can find card elements containing user profiles on which you can “swipe” left or right with the mouse. Swiping left (moving the card to the left) on a user profile card indicates that you are not interested in matching, as opposed to swiping right (moving the card to the right) which indicates interest. If two users swipe right on their respective profiles, there is a match, and they can connect via chat. To test the matching algorithm, you will need to log in into two user accounts separately (one male and one female) and swipe on each other to create a match. You can use some of the accounts provided above.

•	Real-time chat:
Once you have match(es), their profile picture and name will appear on your dashboard under Matches. You can click on their picture to open the chat.

•	Block a user:
This option can be found in the chat.

•	Icebreaker questions:
Also available in the chat interface.

