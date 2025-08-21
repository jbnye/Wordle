interface randomAnswerAnswerResponse{
    answer: string
}
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';
export async function fetchRandomAnswer(signal?: AbortSignal): Promise<randomAnswerAnswerResponse> {
    try{
        const response: Response = await fetch( `${BASE_URL}/api/get-answer`, { signal });
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
        const response = await fetch( `${BASE_URL}/api/check-word`, {
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