# SpareStatistics

Hey! You found the repository for SpareStatistics, the first iOS bowling application that allows for nearly automatic bowling scorekeeping using OCR.

Technologies used:
- React Native
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon S3
- Amazon Textract

# About this project

Bowling scorekeeping can be tedious and therefore acts as a barrier to a consistent scorekeeping habit. I built this project to take down this barrier, allowing bowlers a more comprehensive view of their bowling habits. The image processing feature of SpareStatistics is made possible by Amazon Web Services' OCR service, Amazon Textract. Textract reads the scorecard image sent by the bowler and returns the scorecard in text, allowing for a nearly automatic scorekeeping process.

# Technical Details

<img width="838" alt="Screenshot 2023-11-13 at 10 17 57 AM" src="https://github.com/tyco1ina/sparestatistics-github-version/assets/60575625/553c5453-9cfc-496d-9e8b-bde7eb2d1da9">

Above is the overall system design for SpareStatistics.
