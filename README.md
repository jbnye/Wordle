# Wordle Clone

A full-featured Wordle clone built with React, TypeScript, and Tailwind CSS. This project replicates the original Wordle game's core mechanics, including guess validation, colored feedback, keyboard interaction, flip animations, and error messages.

## Features

- Classic Wordle gameplay with 6 attempts to guess a 5-letter word
- Dynamic tile colors: green (correct), yellow (wrong position), gray (absent)
- On-screen keyboard with letter state tracking
- Flip animations on tiles when a guess is submitted
- Shake animation for invalid guesses
- Backend integration for dynamic word validation and random answer generation
- Fallback to local word list if the backend is offline

## Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express (for word checking and answer selection)

## Lessons Learned

- I struggled setting up typscript express dependancies and the syntax used because there was a recent change in the way things worked. I had to look up what to put in the request and response for types@expressv5.
- Offline/Online server checking and how to handle both.
- First time using express and typescript.

## Demo

[![Watch the video](https://img.youtube.com/vi/YOUTUBE_VIDEO_ID/0.jpg)](https://youtu.be/T0HGE9i48HY)
