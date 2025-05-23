interface randomAnswerAnswerResponse{
    answer: string
}

export async function fetchRandomAnswer(signal?: AbortSignal): Promise<randomAnswerAnswerResponse> {
    try{
        const response: Response = await fetch('http://localhost:3000/get-answer', { signal });
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: randomAnswerAnswerResponse = await response.json();
        return data;
    }  catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Fetch error:', error);
        }
        throw error;
}

}

interface checkIfWordResponse{
    success: boolean,
    message: string
}

export async function fetchCheckIsWord(target: string, signal?: AbortSignal): Promise<checkIfWordResponse>{
    try{
        const response = await fetch('http://localhost:3000/check-word', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({target}),
            signal
        });
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: checkIfWordResponse = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Fetch error:', error);
        }
        throw error;
    }
}