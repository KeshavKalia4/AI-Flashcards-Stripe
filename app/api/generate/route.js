import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long. Return only the JSON and nothing else. The front should be in form of a question and the back should be its answer.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card",
      "flip": false
    }
  ]
}
`

export async function POST(req) {
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: `${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      defaultHeaders: {
        "HTTP-Referer": `${process.env.NEXT_PUBLIC_SITE_URL}`,
        "X-Title": `${process.env.NEXT_PUBLIC_SITE_NAME}`,
      }
    })
    const data = await req.text()
  
    const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: data },
        ],
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        response_format: { type: 'json_object' },
      })
    
      // Parse the JSON response from the OpenAI API
      const flashcards = JSON.parse(completion.choices[0].message.content)
      console.log(flashcards)

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards)
  }