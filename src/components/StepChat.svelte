<script>
  import { Input, Label, Spinner } from "flowbite-svelte";
  import { appStatusInfo, setAppStatusError } from "../store.ts";
  const { id, url, pages } = $appStatusInfo;

  let answer = '';
  let loading = false;

  const numOfImagesToShow = Math.min(pages, 4);
  const images = Array.from({ length: numOfImagesToShow }, (_, i) => {
    const page = i + 1;
    return url
      .replace('/upload/', `/upload/w_400,h_540,c_fill,pg_${page}/`)
      .replace('.pdf', '.jpg');
  });

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    loading = true;
    answer = '';
    const question = event.target.question.value;

    const searchParams = new URLSearchParams();
    searchParams.append('id', id)
    searchParams.append('question', question)

    try {
      const eventSource = new EventSource(`/api/ask?${searchParams.toString()}`);
      
      eventSource.onmessage = (event) => {
        loading = false
        const incomingData = JSON.parse(event.data)

        if(incomingData.type === '__END__') {
          eventSource.close()
          return
        }
        
        answer += incomingData
      }
      
      // const res = await fetch(`/api/ask?${searchParams.toString()}`, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // })

      // if(!res.ok) {
      //   loading = false;
      //   alert('Something went wrong. Please try again later.');
      //   return;
      // }
      
      // const { response } = await res.json();
      // answer = response

    } catch (error) {
      setAppStatusError();
      console.log(error);
    } finally {
      loading = false;
    }
    
  }; 

</script>

<div class="grid grid-cols-4 gap-2">
  {#each images as image}
    <img src={image} alt="PDF page" class="rounded w-full h-auto aspect-[400/540]" />
  {/each}
</div>

<form class="mt-8" on:submit={handleSubmit}>
  <Label for="question" class="block mb-2">Leave your question here</Label>
  <Input id="question" required placeholder="What is this document about?"></Input>
</form>

{#if loading}
  <div class="mt-10 flex flex-col gap-y-2 justify-center items-center">
    <Spinner color="blue" />
    <p class="opacity-75 text-blue-700">
      Uploading and extracting the text...
    </p>
  </div>
{/if}

{#if answer}
  <div class="mt-8">
    <h2 class="text-2xl font-bold">Answer:</h2>
    <p>{answer}</p>
  </div>
{/if}


