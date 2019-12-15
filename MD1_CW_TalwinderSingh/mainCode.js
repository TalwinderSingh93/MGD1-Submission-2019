//Make all window requests
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
        
    //Variable that contains the state of the game(0 == menu screen, 1 == gameplay, 2 == pause screen, 3 == end screen, 4 == instructions, 5 == high score)
    var gameState = 0;
        
	//Canvas variables
	var canvasGameplay = document.getElementById("screenGameplay");
    var canvasMenu = document.getElementById("screenMenu");
    var canvasPause = document.getElementById("screenPause");
	var canvasEnd = document.getElementById("screenEnd");
	
	//Window height and width variables
	var width = window.innerWidth;
	var height = window.innerHeight;
	
	//Context variables
	var ctxGameplay = canvasGameplay.getContext("2d");
    var ctxMenu = canvasMenu.getContext("2d");
    var ctxPause = canvasPause.getContext("2d");
	var ctxEnd = canvasEnd.getContext("2d");
    
    //player settings
	var player = 
    {
		x: width / 2,
		y: height / 2,
		width: 75,
		height: 75,
		velX: 0,
		velY: 0
	};
	var keys = [];
	var friction = 0.8;
	
	//For the 2d animation image
	var startTimeMS = 0; 
    var frameX = 0;
	var frameXCoins = 0;
    var frameXMax = 7;
	var frameXMaxCoins = 4;
    var frameY = 0;
    var frameYMax = 0;
    var frame = 0;
    var frameMax = 7;
	var frameMaxCoins = 4;
    var frameTimer = 0.05;
    var frameTimeMax = 0.017;	
    var spriteWidth = 160;
    var spriteHeight = 160;
    var imgPlayer = new Image();
	
	//Boolean to check if a key is pressed
	var isKeyPressed = false;
        
    //For in-game obstacles
    var imgObsatcle = new Image();
    var pObstacles = [];
	var fObstaclesY = [];
	var iObstaclesDirection = [];
	var bObstaclesMoving = [];
	
	//For in-game coins
	var imgCoins = new Image();
	var imgCoinIcon = new Image();
	var imgHeartIcon = new Image();
	var imgBirdIcon = new Image();
	var pCoins = [];
	
	//Variable that stores the last obstacle hit by player
	var iLastHitObstacle = -1;
        
        
    //Menu buttons
	{
		var imgButtonMenuPlay = new Image();
		var imgButtonMenuInstructions = new Image();
		var imgButtonMenuScore = new Image();
		var imgButtonMenuBack = new Image();
		
		var buttonMenuPlay;
		var buttonMenuInstructions;
		var buttonMenuScore;
		var buttonMenuBack;
	}
   
	//level buttons
	{
		var imgButtonLevelPause = new Image();
		
		var buttonLevelPause;
	}
	
	//Pause buttons
	{
		var imgButtonPauseResume = new Image();
		var imgButtonPausePlay = new Image();
		var imgButtonPauseMenu = new Image();
		
		var buttonPauseResume;
		var buttonPausePlay;
		var buttonPauseMenu;
	}
	
	//End buttons
	{
		var imgButtonEndPlay = new Image();
		var imgButtonEndMenu = new Image();
		
		var buttonEndPlay;
		var buttonEndMenu;
	}
	
	//images for the background moving animation
	var imgBkClouds = new Image();
	var imgBkClouds2 = new Image();
	var imgBkClouds3 = new Image();
	var iCloudsTransition = 0;
	
	//Game instructions image
	var imgInstructions = new Image();
	
	//Game title image
	var imgGameTitle = new Image();
	
	//Switch variable for the pause menu
	var iPauseSwitch = 0;
	
	//Game data variables
	var iScore = 0;
	var iCoins = 0;
	var iLifes = 2;
	var iGameSpeed = 0;
	var iObstacleVerticleRange = 150;
    var iFinalScore = 0;
	var bEndGame = false;
	var iHighScores = new Array(0,0,0,0,0,0,0,0,0,0);
	
	//Sound variables
	var pSoundFlapBird;
	var pSoundMenu;
	var pSoundLevel;
	var pSoundEnd;
	var pSoundClick;
	var pSoundCoin;
	var pSoundCollision;
	
	//Animation variables
	var bLifeLostAnimation;
	var iLifeLostBlinkAnimIterations;

    //For loop to create obstacles objects
    for(var iCount = 0; iCount < 7; iCount++)
    {
        //assign the position and size of obstacles
        pObstacles.push(
        {
            x: width + 100 + (iCount*400),
            y: Math.floor((Math.random() * (height - 300)) + 1),
            width: 30,
            height: 300
        }); 
    }
	
	//For loop to create coin objects
	for(var iCount = 0; iCount < 25; iCount++)
    {
        //assign the position and size of coins
        pCoins.push(
        {
            x: width + 100 + (iCount*40),
            y: Math.floor((Math.random() * (height - 16)) + 1),
            width: 16,
            height: 16
        }); 
    }
		
    //Game loop
	window.addEventListener("load", function () 
    {
		start();
		update();
	});
	
    //Start function to initialise the variables
	function start()
    {
		//Initialize player data
		player.x = width / 2;
		player.y = height / 2;
		
		//Initialize game data
		iCloudsTransition = 0;
		iScore = 0;
		iCoins = 0;
		iLifes = 2;
		iGameSpeed = 0;
		iLifeLostBlinkAnimIterations = 3;
		iLastHitObstacle = -1;
		bEndGame = false;
		bLifeLostAnimation = false;
		
		//Check if cookies exist otherwise create them
		CreateCookies();
		
		//Set the height and width for the all canvas
		canvasEnd.width = width;
		canvasEnd.height = height;
	
		canvasGameplay.width = width;
		canvasGameplay.height = height;
        
        canvasPause.width = width;
		canvasPause.height = height;
        
        canvasMenu.width = width;
		canvasMenu.height = height;
		
        //assign the image to the objects
        imgObsatcle.src = 'Obstacle.png';
		imgCoins.src = 'coins.png';
		imgHeartIcon.src = 'heart.png';
		imgCoinIcon.src = 'coin.png';
		imgBirdIcon.src = 'birdIcon.png';
        imgPlayer.src = 'bird.png';
		imgGameTitle.src = 'game_title.png';
        
        //assign the image to the menu screen buttons
        imgButtonMenuPlay.src = 'ScreenMenuButtons//button_play.png';
        imgButtonMenuInstructions.src = 'ScreenMenuButtons//button_instructions.png';
        imgButtonMenuScore.src = 'ScreenMenuButtons//button_high-score.png';
		imgButtonMenuBack.src = 'ScreenMenuButtons//button_back.png';
		screenMenu();
		
		//Assign the image to the level screen buttons
		imgButtonLevelPause.src = 'ScreenLevelButtons//button_pause.png';
		
		//assign the image to the pause screen buttons
        imgButtonPausePlay.src = 'ScreenPauseButtons//button_start-again.png';
        imgButtonPauseMenu.src = 'ScreenPauseButtons//button_go-to-menu.png';
        imgButtonPauseResume.src = 'ScreenPauseButtons//button_resume.png';
		screenPause();
		
		//assign the image to the end screen buttons
        imgButtonEndPlay.src = 'ScreenEndButtons//button_play-again.png';
        imgButtonEndMenu.src = 'ScreenEndButtons//button_go-to-menu.png';
		screenEnd();
		
		//background moving animation images
		imgBkClouds.src = 'Background.png';
		imgBkClouds2.src = 'Background2.png';
		imgBkClouds3.src = 'Background.png';
		
		//Instructions scene image
		imgInstructions.src = 'Instructions.png';
		
		//Initialize sounds objects
		pSoundFlapBird = new sound("Sounds//BirdFlapSound.mp3");
		pSoundMenu = new sound("Sounds//menu_music.mp3");
		pSoundLevel = new sound("Sounds//level_music.mp3");
		pSoundEnd = new sound("Sounds//end_music.mp3");
		pSoundClick = new sound("Sounds//click_sound.mp3");
		pSoundCoin = new sound("Sounds//coin_sound.mp3");
		pSoundCollision = new sound("Sounds//collision_sound.mp3");
		
		
		//Set obstacles position dynamically
        for(var iCount = 0; iCount < 7; iCount++)
        {
            pObstacles[iCount].x= width + 100 + (iCount*400);
            pObstacles[iCount].y= Math.floor((Math.random() * (height - 300)) + 1);
			
			fObstaclesY[iCount] = pObstacles[iCount].y;
			iObstaclesDirection[iCount] = Math.floor((Math.random() * 100) + 1);
			
			if(Math.floor((Math.random() * 100) + 1)%2 == 0)
			{
				bObstaclesMoving[iCount] = true;
			}
			else
			{
				bObstaclesMoving[iCount] = false;
			}
        }
		
		//Set coins position dynamically
		for(var iCount = 0; iCount < pCoins.length; iCount++)
        {
            pCoins[iCount].x= width + 100 + (iCount*40);
            pCoins[iCount].y= Math.floor((Math.random() * (height - 16)) + 1);
        }
	}
	
	//Function for the animation handeling
	function deathAnimationFrame()
    {
		var elapsed = (Date.now() - startTimeMS)/1000;
		startTimeMS = Date.now();

		//only update frames when timer is below 0
		frameTimer = frameTimer - elapsed;
		if(frameTimer <= 0)
		{
			frameTimer = frameTimeMax;
			
			if(frameX < frameXMax)
			{
				frameX = frameXMax;
			}
			else
			{
				frameX++;
			}
					
			if(frameX>frameXMax + 2)
			{
			  frameX = 0;
			  frameY++;
			  //end of row, move down to next row in sheet
			  if(frameY>frameYMax)
			  {
				  frameY = 0;
			  }
			}
			
			frame++;
			//reset frames to 0 in event that there are empty spaces on sprite sheet
			if(frame > frameMax + 2)
			{
				if(iLifeLostBlinkAnimIterations < 0)
				{
					bLifeLostAnimation = false;
					iLifeLostBlinkAnimIterations = 3;
				}
				else
				{
					iLifeLostBlinkAnimIterations--;
				}
				
				frame = 0;
				frameX = 0;
				frameY = 0;
			}
		}
	}
	
	
    //Function for the animation handeling
	function animationFrame()
    {
		var elapsed = (Date.now() - startTimeMS)/1000;
		startTimeMS = Date.now();

		//only update frames when timer is below 0
		frameTimer = frameTimer - elapsed;
		if(frameTimer <= 0)
		{
			frameTimer = frameTimeMax;
			frameX++;
			frameXCoins++;
			if(frameX>frameXMax)
			{
			  frameX = 0;
			  frameY++;
			  //end of row, move down to next row in sheet
			  if(frameY>frameYMax)
			  {
				  frameY = 0;
			  }
			}
			
			if(frameXCoins>frameXMaxCoins)
			{
			  frameXCoins = 0;
			}
			
			frame++;
			//reset frames to 0 in event that there are empty spaces on sprite sheet
			if(frame > frameMax)
			{
			  frame = 0;
			  frameX = 0;
			  frameY = 0;
			}
		}
	
	}
        
    //collider function
    function colCheck(shapeA, shapeB)
    {
		// get the vectors to check against
		var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
			vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;
        
        if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) 
        {
			// figures out on which side we are colliding (top, bottom, left, or right)
			var oX = hWidths - Math.abs(vX),
				oY = hHeights - Math.abs(vY);
			if (oX >= oY) 
            {
				if (vY > 0) 
                {
					colDir = "t";
					if(iLifes < 0)
					shapeA.y += oY;
				} 
                else
                {
					colDir = "b";
					if(iLifes < 0)
					shapeA.y -= oY;
				}
			} 
            else 
            {
				if (vX > 0)
                {
					colDir = "l";
					if(iLifes < 0)
					shapeA.x += oX;
				} 
                else 
                {
					colDir = "r";
					if(iLifes < 0)
					shapeA.x -= oX;
				}
			}
		}
		return colDir;
	}	

	//Function to create cookies if they are not already created, these cookies will hold the 10 highiest scores registred in the game
    function CreateCookies()
    {
		for(var iCount = 1; iCount < 11; iCount++)
		{
			//Create the cookie pair name
			var bCookieFound = false;
			var szName = "Score"+ iCount + "=";
			var pCookies = document.cookie.split(';');
			for(var i = 0; i < pCookies.length; i++) 
			{
				var cookie = pCookies[i];
				while (cookie.charAt(0) == ' ') {
				  cookie = cookie.substring(1);
				}
				//Check if the cookie already exist
				if (cookie.indexOf(szName) == 0) 
				{
					bCookieFound = true;
					iHighScores[iCount - 1] = parseInt(cookie.substring(szName.length, cookie.length));
					console.log(cookie);
				}
			}
			
			//If the cookie doesnt exist then create it
			if(bCookieFound == false)
			{
				var pDate = new Date();
				pDate.setTime(pDate.getTime() + (60 * 24 * 60 * 60 * 1000));
				var expires = "expires="+pDate.toUTCString();
				document.cookie = szName + "0" + ";" + expires + ";path=/;SameSite=strict";
				var test = document.cookie.split(';');
				console.log(test);
			}
		}
	}
	
	//The function is used to update the high score list if there is a new high score
	function CheckIfNewHighScore()
    {
        if(bEndGame)
        {
            return 0;
        }
        
		var bNewHighScore = false;
		//For loop to check if the last registred score from the user needs to be saved
		for(var iCount = 0; iCount < 10 && bNewHighScore == false; iCount++)
		{
			console.log(iHighScores[iCount]);
            
            if(iHighScores[iCount] < iScore)
			{
                console.log(iCount);
				bNewHighScore = true;
				for(var iCount2 = 9; iCount2 > iCount; iCount2--)
				{
					iHighScores[iCount2] = iHighScores[iCount2 - 1];  
				}
                
                iHighScores[iCount] = Math.round(iScore);
			}
		}
        
        console.log(iHighScores);
		
		//If there is new high score then the data needs to be saved on the cookies
		if(bNewHighScore)
		{
			for(var iCount = 1; iCount < 11; iCount++)
			{
				var szName = "Score"+ iCount + "=";
				var pDate = new Date();
				pDate.setTime(pDate.getTime() + (60 * 24 * 60 * 60 * 1000));
				var expires = "expires="+pDate.toUTCString();
				document.cookie = szName + iHighScores[iCount - 1] + ";" + expires + ";path=/;SameSite=strict";
			}
		}
        
        iFinalScore = Math.round(iScore);
	}
	
	//Method to handle sound and music
	function sound(src) 
	{
	  this.sound = document.createElement("audio");
	  this.sound.src = src;
	  this.sound.setAttribute("preload", "auto");
	  this.sound.setAttribute("controls", "none");
	  this.sound.style.display = "none";
	  document.body.appendChild(this.sound);
	  
	  this.play = function()
	  {
		this.sound.play();
	  }
	  
	  this.stop = function()
	  {
		this.sound.pause();
	  }
	}
	
	//Function to handle end screen rendering
    function screenEnd()
    {
        //Setting buttons position
        buttonEndPlay =
        {
            x:canvasEnd.width/2 -130,
            y:canvasEnd.height/2 -150,
            width:imgButtonEndPlay.width,
            height:imgButtonEndPlay.height
        };
        
        buttonEndMenu = 
        {
            x:canvasEnd.width/2 -130,
            y:canvasEnd.height/2 -100,
            width:imgButtonEndMenu.width,
            height:imgButtonEndMenu.height
        };
        
       
        ctxEnd.drawImage(imgButtonEndPlay, buttonEndPlay.x, buttonEndPlay.y, imgButtonEndPlay.width, imgButtonEndPlay.height);
        ctxEnd.drawImage(imgButtonEndMenu, buttonEndMenu.x, buttonEndMenu.y, imgButtonEndMenu.width, imgButtonEndMenu.height);
		
		ctxEnd.fillStyle = "gray";
		ctxEnd.textAlign = "center";
		ctxEnd.font = "32px Cooper Black";
		ctxEnd.fillText("Game Over!!", canvasEnd.width/2, canvasEnd.height/2 -300);
		ctxEnd.fillText("Score: " + iFinalScore + "m", canvasEnd.width/2, canvasEnd.height/2 -250);
    }
    
    //Function to handle pause screen rendering
    function screenPause()
    {
        //Setting buttons position
        buttonPausePlay =
        {
            x:canvasMenu.width/2 -130,
            y:canvasMenu.height/2 -150,
            width:imgButtonPausePlay.width,
            height:imgButtonPausePlay.height
        };
        
        buttonPauseMenu = 
        {
            x:canvasMenu.width/2 -130,
            y:canvasMenu.height/2 -100,
            width:imgButtonPauseMenu.width,
            height:imgButtonPauseMenu.height
        };
        
        buttonPauseResume = 
        {
            x:canvasMenu.width/2 -130,
            y:canvasMenu.height/2 -50,
            width:imgButtonPauseResume.width,
            height:imgButtonPauseResume.height
        };
		
		//Setting pause button position
		buttonLevelPause =
		{
			x:canvasGameplay.width - 60,
			y: 20,
			width:imgButtonLevelPause.width,
			height:imgButtonLevelPause.height
		};
        
        ctxPause.drawImage(imgButtonPausePlay, buttonPausePlay.x, buttonPausePlay.y, imgButtonPausePlay.width, imgButtonPausePlay.height);
        ctxPause.drawImage(imgButtonPauseMenu, buttonPauseMenu.x, buttonPauseMenu.y, imgButtonPauseMenu.width, imgButtonPauseMenu.height);
        ctxPause.drawImage(imgButtonPauseResume, buttonPauseResume.x, buttonPauseResume.y, imgButtonPauseResume.width, imgButtonPauseResume.height);
    }
        
    //Function to handle pause screen rendering
    function screenMenu()
    {
		//Setting buttons position
        buttonMenuPlay =
        {
            x:canvasMenu.width/2 -130,
            y:canvasMenu.height/2 -150,
            width:imgButtonMenuPlay.width,
            height:imgButtonMenuPlay.height
        };
        
        buttonMenuScore = 
        {
            x:canvasMenu.width/2 -130,
            y:canvasMenu.height/2 -50,
            width:imgButtonMenuPlay.width,
            height:imgButtonMenuPlay.height
        };
        
        buttonMenuInstructions = 
        {
            x:canvasMenu.width/2 -130,
            y:canvasMenu.height/2 -100,
            width:imgButtonMenuPlay.width,
            height:imgButtonMenuPlay.height
        };
		
		//Setting buttons position
        buttonMenuBack =
        {
            x:canvasMenu.width/2 -330,
            y:canvasMenu.height/2 -100,
            width:imgButtonMenuBack.width,
            height:imgButtonMenuBack.height
        };
		
	
		ctxMenu.drawImage(imgGameTitle, canvasMenu.width/2 -190, canvasMenu.height/2 - 300, imgGameTitle.width, imgGameTitle.height);
        ctxMenu.drawImage(imgButtonMenuPlay, buttonMenuPlay.x, buttonMenuPlay.y, imgButtonMenuPlay.width, imgButtonMenuPlay.height);
        ctxMenu.drawImage(imgButtonMenuInstructions, buttonMenuInstructions.x, buttonMenuInstructions.y, imgButtonMenuInstructions.width, imgButtonMenuInstructions.height);
        ctxMenu.drawImage(imgButtonMenuScore, buttonMenuScore.x, buttonMenuScore.y, imgButtonMenuScore.width, imgButtonMenuScore.height);
    }
	
	//Function to handle menu instructions screen rendering
    function screenMenuInstructions()
    {
       ctxMenu.drawImage(imgInstructions, 0, 0, width, height);
	   ctxMenu.drawImage(imgButtonMenuBack, buttonMenuBack.x, buttonMenuBack.y, imgButtonMenuBack.width, imgButtonMenuBack.height);
    }
	
	//Function to handle menu high score screen rendering
    function screenMenuHighScore()
    {
		ctxMenu.drawImage(imgButtonMenuBack, buttonMenuBack.x, buttonMenuBack.y, imgButtonMenuBack.width, imgButtonMenuBack.height);
		
		ctxGameplay.fillStyle = "gray";
		ctxGameplay.textAlign = "center";
		ctxGameplay.font = "32px Cooper Black";
		
		for(var iCount= 0; iCount < 10; iCount++)
		{
			ctxGameplay.fillText("High Score "+(iCount+1)+": " + iHighScores[iCount] + "m", canvasMenu.width/2, (canvasMenu.height/2) + 30*iCount - 200);
		}
	
	}
    
	//Games's main update function
	function update() 
    {
        ctxEnd.clearRect(0, 0, width, height);
		ctxPause.clearRect(0, 0, width, height);
        ctxGameplay.clearRect(0, 0, width, height);
        ctxMenu.clearRect(0, 0, width, height);
        
		//If the game state is in main menu mode
		if(gameState == 0)
		{
			screenMenu();
		}
		else if((gameState == 1) || (gameState == 2))
		{
			pSoundLevel.play();
			pSoundMenu.stop();
			
			if(gameState == 1)
			{
				//Player input movements
				if (keys[40]) 
				{
					// top arrow
					if(player.y < canvasGameplay.height-player.height)
						player.velY++;
				}
				
				if (keys[38]) 
				{
					// down arrow
					if(player.y>40)
						player.velY--;
				}
				else
				{
					if(player.y < canvasGameplay.height-player.height)
						player.velY++;
				}
				
				if (keys[39]) 
				{
					// right arrow
					if(player.x<(canvasGameplay.width-player.width))
						player.velX++;
				}
				if (keys[37]) 
				{
					// left arrow
					if(player.x>player.width)
						player.velX--;
				}
				
				//If the game state is in pause mode
				if (iPauseSwitch == 2) 
				{
					// Pause the game
					gameState = 2;
					iPauseSwitch = 0;
				}
			}
			
			
		
			player.velX *= friction;
			player.velY *= friction;
			player.x += player.velX;
			player.y += player.velY;
			
			//For player forward moving animation
			ctxGameplay.drawImage(imgBkClouds, 0, 0, imgBkClouds.width, imgBkClouds.height, iCloudsTransition, 0, window.width, window.height);
			ctxGameplay.drawImage(imgBkClouds2, 0, 0, imgBkClouds2.width, imgBkClouds2.height, window.width + iCloudsTransition, 0, window.width, window.height);
			ctxGameplay.drawImage(imgBkClouds3, 0, 0, imgBkClouds3.width, imgBkClouds3.height, (window.width*2) + iCloudsTransition, 0, window.width, window.height);
			
			//Update moving background variables only if the game state is in play mode
			if(gameState == 1)
			{
				//render pause button
				ctxGameplay.drawImage(imgButtonLevelPause, buttonLevelPause.x, buttonLevelPause.y, imgButtonLevelPause.width, imgButtonLevelPause.height);
				
				//Update background moving landscape variable
				if(Math.abs(iCloudsTransition) > (window.width*2))
				{
					iCloudsTransition = 0;
				}
				else
				{
					iCloudsTransition = iCloudsTransition - (2 + iGameSpeed/500);
				}
			
				//Update score
				iScore = iScore + (0.1 + iGameSpeed/10000);// 
				
				//Update game speed
				iGameSpeed++;
			}
			
			//Update player information such as current score, health and collected coins
			ctxGameplay.fillStyle = "gray";
			ctxGameplay.textAlign = "center";
			ctxGameplay.font = "20px Cooper Black";
			ctxGameplay.drawImage(imgBirdIcon, 30, 20, imgBirdIcon.width, imgBirdIcon.height);
			ctxGameplay.drawImage(imgHeartIcon, 30, 60, imgHeartIcon.width, imgHeartIcon.height);
			ctxGameplay.drawImage(imgCoinIcon, 30, 100, imgCoinIcon.width, imgCoinIcon.height);
			ctxGameplay.fillText(" " + Math.round(iScore) + "m", 100, 50);
			ctxGameplay.fillText(" " + iLifes, 80, 80);
			ctxGameplay.fillText(" " + iCoins, 80, 120);
			
			
			//Bird animations handeling
			if(bLifeLostAnimation == true)
			{
				deathAnimationFrame();
				ctxGameplay.drawImage(imgPlayer, spriteWidth*frameX, spriteHeight*frameY, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
			}
			else
			{
				animationFrame();
				if(isKeyPressed == true && gameState == 1)
				{
					ctxGameplay.drawImage(imgPlayer, spriteWidth*frameX, spriteHeight*frameY, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
					pSoundFlapBird.play();
					
				}
				else
				{
					ctxGameplay.drawImage(imgPlayer, 0, 0, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
				}
			}
			
			//End game 
			if(bEndGame)
			{
				gameState = 3;
			}
				
			//Check for each obstacle if there was a contact between the player
			for (var i = 0; i < pObstacles.length; i++)
			{
				if(gameState == 1)
				{
					//If the obstacle is still in the player's view then update the obstacle position
					if(pObstacles[i].x > -50)
					{
						pObstacles[i].x = pObstacles[i].x - (2 + iGameSpeed/500); 
						
						if(bObstaclesMoving[i])
						{
							if(iObstaclesDirection[i]%2 == 0)
							{
								if(pObstacles[i].y > (fObstaclesY[i] - iObstacleVerticleRange)) 
									pObstacles[i].y = pObstacles[i].y - (2 + iGameSpeed/50000);
								else
									iObstaclesDirection[i] = 1;
							}
							else
							{
								if(pObstacles[i].y < (fObstaclesY[i] + iObstacleVerticleRange)) 
									pObstacles[i].y = pObstacles[i].y + (2 + iGameSpeed/50000);
								else
									iObstaclesDirection[i] = 0;
							}
						}	
					}
					//Otherwise set a new position for the obstacle
					else
					{	
						if(i == 0)
                        {
                            pObstacles[0].x= pObstacles[pObstacles.length - 1].x + 400;
				            pObstacles[0].y= Math.floor((Math.random() * (height - 300)) + 1);
							
							fObstaclesY[0] = pObstacles[0].y;
							iObstaclesDirection[0] = Math.floor((Math.random() * 100) + 1);
							
							if(Math.floor((Math.random() * 100) + 1)%2 == 0)
							{
								bObstaclesMoving[0] = true;
							}
							else
							{
								bObstaclesMoving[0] = false;
							}
                        }
						//to make sure that atleast one obstacle is present at bottom of the screen 
						else if( i == 2)
						{
                            pObstacles[i].x= pObstacles[i - 1].x + + 400;
				            pObstacles[i].y= (height - 300);
                        }
						//to make sure that atleast one obstacle is present at top of the screen
						else if( i == 5)
						{
                            pObstacles[i].x= pObstacles[i - 1].x + + 400;
				            pObstacles[i].y= 0;
                        }
                        else
                        {
                            pObstacles[i].x= pObstacles[i - 1].x + + 400;
				            pObstacles[i].y= Math.floor((Math.random() * (height - 300)) + 1);
                        }
						
						//for the obstacle vertical movement
						if(i != 0)
                        {
							fObstaclesY[i] = pObstacles[i].y;
							iObstaclesDirection[i] = Math.floor((Math.random() * 100) + 1);
							
							if(Math.floor((Math.random() * 100) + 1)%2 == 0)
							{
								bObstaclesMoving[i] = true;
							}
							else
							{
								bObstaclesMoving[i] = false;
							}
						}
				
					}
				}
				
				// draw the obstacles on canvas
				ctxGameplay.rect(pObstacles[i].x, pObstacles[i].y, pObstacles[i].width - 5 , pObstacles[i].height - 5);
				ctxGameplay.drawImage(imgObsatcle, pObstacles[i].x, pObstacles[i].y, pObstacles[i].width, pObstacles[i].height);
				//ctxGameplay.drawImage(imgBkClouds, 0, 0, imgBkClouds.width, imgBkClouds.height, iCloudsTransition, 0, window.width, window.height);
				
				// check if collide with players
				var dir = colCheck(player, pObstacles[i]);

				if (dir === "l" || dir === "r") 
				{
					if(iLastHitObstacle != i)
					{
						pSoundCollision.play();
						iLastHitObstacle = i;
						iLifes--;
						iGameSpeed = 0;
						bLifeLostAnimation = true;
						if(iLifes < 0)
						{
							player.velX = 0;
							console.log(pObstacles[i].x + " " + pObstacles[i].y)
							CheckIfNewHighScore();
							bEndGame = true;
						}
					}	
				}
				else if(dir === "t" || dir === "b")
				{
					if(iLastHitObstacle != i)
					{
						pSoundCollision.play();
						iLastHitObstacle = i;
						iLifes--;
						iGameSpeed = 0;
						bLifeLostAnimation = true;
						if(iLifes < 0)
						{
							player.velY = 0;
							console.log(pObstacles[i].x + " " + pObstacles[i].y)
							CheckIfNewHighScore();
							bEndGame = true;
						}
					}
				}
			}
			
			//Update coins position
			for (var i = 0; i < pCoins.length; i++)
			{
				if(gameState == 1)
				{
					//If the coins are visible to the player then update position
					if(pCoins[i].x > -50)
					{
						pCoins[i].x = pCoins[i].x - (2 + iGameSpeed/500);
					}
					//otherwise set a new position
					else
					{	
						pCoins[i].x= width + 100 + (i*40);
						pCoins[i].y= Math.floor((Math.random() * (height - 16)) + 1);
					}
				}
				
				// Draw the obstacles on canvas
				ctxGameplay.rect(pCoins[i].x, pCoins[i].y, 16 , 16);
				if(gameState == 1)
				{
					ctxGameplay.drawImage(imgCoins, 16*frameXCoins, 16*frameY, 16, 16, pCoins[i].x, pCoins[i].y, 16, 16);
				}
				else
					ctxGameplay.drawImage(imgCoins, 0, 0, 16, 16, pCoins[i].x, pCoins[i].y, 16, 16);
				//ctxGameplay.drawImage(imgPlayer, spriteWidth*frameX, spriteHeight*frameY, spriteWidth, spriteHeight, player.x, player.y, player.width, player.height);
				
				// check if the coins collide with the player
				var dir = colCheck(player, pCoins[i]);

				if (dir === "l" || dir === "r") 
				{
					pCoins[i].x= width + 100 + (i*40);
					pCoins[i].y= Math.floor((Math.random() * (height - 16)) + 1);
					iCoins++;
					pSoundCoin.play();
					if(iCoins>=50)
					{
						iLifes++;
						iCoins -= 50;
					}
				}
				else if(dir === "t" || dir === "b")
				{
					pCoins[i].x= width + 100 + (i*40);
					pCoins[i].y= Math.floor((Math.random() * (height - 16)) + 1);
					iCoins++;
					pSoundCoin.play();
					if(iCoins>=50)
					{
						iLifes++;
						iCoins -= 50;
					}
				}
			}

			
			
		}
		
		//If the game state is in pause mode
		if(gameState == 2)
		{
			pSoundLevel.stop();
			//Draw the pause canvas
			screenPause();
			
			if (iPauseSwitch == 2) 
			{
				// Pause the game
				gameState = 1;
				iPauseSwitch = 0;				
			}
		}
		
		//If the game state is in end mode
		if(gameState == 3)
		{
			pSoundLevel.stop();
			pSoundEnd.play();
			//console.log(gameState);
			//Draw the end canvas
			screenEnd();
		}
		
		//If the game state is in menu instructions mode
		if(gameState == 4)
		{
			screenMenuInstructions();
		}
		
		//If the game state is in menu high score mode
		if(gameState == 5)
		{
			screenMenuHighScore();
		}
		
		requestAnimationFrame(update);
	}
    
    
    //Function to get the mouse position
    function getMousePos(canvasGameplay, event) 
    {
        var rect = canvasGameplay.getBoundingClientRect();
        var returnObject = 
        {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        
        return returnObject;   
    }
    
    //Function to check whether a point is inside a rectangle
    function isInside(pos, rect)
    {
		if(pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y)
		{
			return true;
		}
		else
		{
			return false;
		}
         
    }
	
	
    //Binding the click event on the canvas
    canvasMenu.addEventListener('click', function(evt) 
    {
		var mousePos = getMousePos(canvasMenu, evt);
	
		//If the player is in menu scene
		if(gameState == 0)
		{
			if (isInside(mousePos,buttonMenuInstructions)) 
			{
				pSoundClick.play();
				gameState = 4;
			}
			else if(isInside(mousePos,buttonMenuScore))
			{
				pSoundClick.play();
				gameState = 5;
			}
			else if(isInside(mousePos,buttonMenuPlay))
			{
				pSoundClick.play();
				start();
				gameState = 1;
				pSoundMenu.stop();				
			}
		}
		
		//If the player is in level scene
		if(gameState == 1)
		{
			if (isInside(mousePos,buttonLevelPause)) 
			{
				pSoundClick.play();
				gameState = 2;
			}
		}
		
		//If the player is in pause page
		if(gameState == 2)
		{
			if (isInside(mousePos,buttonPauseResume)) 
			{
				pSoundClick.play();
				gameState = 1;
			}
			else if(isInside(mousePos,buttonPauseMenu))
			{
				pSoundClick.play();
				gameState = 0;
			}
			else if(isInside(mousePos,buttonPausePlay))
			{
				pSoundClick.play();
				start();
				gameState = 1;
			}
		}
		
		//If the player is in end scene
		if(gameState == 3)
		{
			if(isInside(mousePos,buttonEndMenu))
			{
				pSoundEnd.stop();
				pSoundClick.play();
				gameState = 0;
			}
			else if(isInside(mousePos,buttonEndPlay))
			{
				pSoundEnd.stop();
				pSoundClick.play();
				start();
				gameState = 1;
			}
		}
		
		//If the player is in instructions page
		if(gameState == 4)
		{
			if(isInside(mousePos,buttonMenuBack))
			{
				pSoundClick.play();
				gameState = 0;
			}
		}
		
		//If the player is in high score page
		if(gameState == 5)
		{
			if(isInside(mousePos,buttonMenuBack))
			{
				pSoundClick.play();
				gameState = 0;
			}
		}
        
        
    }, false);    

	document.body.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;

        if ((keys[37] == true) || (keys[38] == true) || (keys[39] == true) || (keys[40] == true)) {

            isKeyPressed = true;
        }
		
		if(keys[27] == true && (gameState == 1 || gameState == 2))
		{
			iPauseSwitch = 1;
		}
		    
	});

	document.body.addEventListener("keyup", function (e) {
		keys[e.keyCode] = false;
		isKeyPressed = false;
		
		if(keys[27] == false && (gameState == 1 || gameState == 2))
		{
			if(iPauseSwitch == 1)
				iPauseSwitch = 2;
		}
		
	});