```mermaid
flowchartLR
start-->project

project-->audio-api-1-->audio-gpu-1-->conversation-1
project-->audio-api-2-->audio-gpu-2-->conversation-2
project-->audio-api-3-->audio-gpu-3-->conversation-3

conversation-1-->calculate
conversation-2-->calculate
conversation-3-->calculate

calculate-->gpu-1-->render-1-->postrender
calculate-->gpu-2-->render-2-->postrender
calculate-->gpu-3-->render-3-->postrender

postrender-->end