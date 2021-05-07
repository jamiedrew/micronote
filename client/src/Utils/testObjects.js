import {Note} from "./Classes/note";

export const testUser = {
    username: "pizza_crime",
    password: "dogsuffrage"
}

export const testNote = {
    id: "4565ffc8-ffd9-4054-82d3-1be3dc86edc1",
    text: "Sphinx of black quartz, judge my vow!",
    createdDate: "2021-04-29T11:34:24.785Z",
    modifiedDate: "2021-04-29T11:34:31.869Z"
  };

export const testList = [
    new Note("I just got used to the new normal! How can I be expected to go back to the old normal all of a sudden?" ),
    new Note("Only one of us can be 'the funny one.'"),
    new Note("It's a shame there isn't a pill to stimulate conversation."),
    new Note("We can't chant 'Om' if everybody lip-synchs."),
    new Note("Do you know how hard it is to have a full-time job and also be writing a book?")
]