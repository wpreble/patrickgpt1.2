import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const assistantId = "asst_ZasLAQtRXuj5bKNRiq6jEmeh" // Your Assistant ID

// Helper function to poll for run completion
async function waitForRunCompletion(threadId: string, runId: string) {
  let runStatus
  do {
    await new Promise((resolve) => setTimeout(resolve, 500)) // Poll every 500ms
    runStatus = await openai.beta.threads.runs.retrieve(threadId, runId)
  } while (runStatus.status === "queued" || runStatus.status === "in_progress")
  return runStatus
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const userMessage = body.message
    let threadId = body.threadId

    if (!userMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Create a new thread if no threadId is provided
    if (!threadId) {
      const thread = await openai.beta.threads.create()
      threadId = thread.id
    }

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage,
    })

    // Create a run to get the assistant's response
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    })

    // Wait for the run to complete
    const completedRun = await waitForRunCompletion(threadId, run.id)

    if (completedRun.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId)
      // Find the latest assistant message
      const assistantMessages = messages.data.filter((msg) => msg.role === "assistant")
      const lastAssistantMessage = assistantMessages.sort((a, b) => b.created_at - a.created_at)[0]

      if (lastAssistantMessage && lastAssistantMessage.content[0]?.type === "text") {
        const assistantReply = lastAssistantMessage.content[0].text.value
        return NextResponse.json({ reply: assistantReply, threadId })
      } else {
        return NextResponse.json({ error: "No text response from assistant" }, { status: 500 })
      }
    } else {
      console.error("Run failed or requires action:", completedRun)
      return NextResponse.json(
        { error: "Assistant run did not complete successfully", details: completedRun.status },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in /api/chat:", error)
    let errorMessage = "Internal Server Error"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
