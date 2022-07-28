// let currentPosts = [];
// currentPosts[`example`] = {
//     title: `history`,
//     date: `1234`,
//     summary: `jfkajfl`
// };
/**
 * @typedef {{
 *  title: string,
 *  date: string,
 *  summary: string,
 * }} BlogPost
 */
/* Storage Layer
 * ============= */

/**
 * @returns the JSON map of books from local storage.
 */
 function loadPosts() {
    return JSON.parse(localStorage.getItem('posts')) || {};
}

/**
 * @param {{string: BlogPost}} books a JSON map of id->post to put into local storage.
 */
function storePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}


document.addEventListener('DOMContentLoaded', (_ev) => {
    //Display current posts in storage
    const currentPosts = loadPosts();
    for (const [postId, post] of Object.entries(currentPosts)) {
        // let el = createPost(postId, post);
        // console.log(el);
        // postContainer.appendChild(el);
        // attachEventListeners(el);
        renderPost(postId, post);
    }
    const addBtn = document.getElementById('add-btn');
    const newPostModal = document.getElementById('new-post-modal');
    addBtn.addEventListener('click', () => {
        newPostModal.showModal();
    });

    const newPostForm = document.getElementById('new-post-form');
    newPostForm.addEventListener('submit', (ev) => {

        ev.preventDefault();

        const formData = new FormData(ev.target);
        const post = {};
        for (const [key,value] of formData.entries()) {
            post[key] = value;
        }

        console.log(post);
        //Add post to local storage (array)
        //post.dataset.id = insertPost(post);
        //Clear form fields after submit
        let postId = insertPost(post);
        //console.log(newPostId);
        newPostModal.close();
        newPostForm.reset();
        // for (const [postId, post] of Object.entries(currentPosts)) {
        //     // let el = createPost(postId, post);
        //     // console.log(el);
        //     // postContainer.appendChild(el);
        //     // attachEventListeners(el);
        //     renderPost(postId, post);
        //     console.log(document.querySelector(`div`).getAttributeNames());
        // }
        renderPost(postId, post);
        console.log(currentPosts);
    });

});

/**
 * (CREATE) Add a new book to the DB. 
 * @param {BlogPost} [post] the post to be added to the DB.
 * @returns {String} the generated UUID for this post in the DB.
 */

function insertPost(post) {
    const currentPosts = loadPosts();
    const postId = crypto.randomUUID();
    currentPosts[postId] = post;
    storePosts(currentPosts);

    return postId;
}

/**
 * (READ) Read a specific book from the DB.
 * @param {string} [postId] the id of the post to look up. 
 * @returns {BlogPost | undefined} if the post is found, or undefined if not found.
 */
function selectPost(postId) {
    const currentPosts = loadPosts();
    return currentPosts[postId];
}

/**
 * (READ) Return _all_ posts from the DB.
 * @returns {BlogPost[]} the array of current posts in the DB
 */

function selectAllPosts() {
    const currentPosts = loadPosts();
    return currentPosts;
}

/**
 * (UPDATE) Update a book in the DB.
 * @param {string} [postId] the id of the post to update.
 * @param {BlogPost} [post] the new post data to replace the old one with.
 */
function updatePost(postId, post) {
    const currentPosts = loadPosts();
    currentPosts[postId] = post;
    storePosts(currentPosts);
}

/**
 * (DELETE) Delete a post from the DB.
 * @param {string} [postId] the id of the post to delete. 
 * @returns {bool} true if we deleted an element, false if not.
 */
function deletePost(postId) {
    const currentPosts = loadPosts();
    // If it's not there, just return false. If it is there, delete it.
    if (!(postId in currentPosts)) return false;
    delete currentPosts[postId];
    storePosts(currentPosts);
    return true;
}


/**
 * @param {string} [postId] the id of the post to render
 * @param {BlogPost} [post] the post to render
 * @returns {Element} the HTML blog post element
 */

function createPost(postId, post) {
    console.log(postId);
    const postContainer = document.getElementById('post-container');
    const template = document.getElementById('blog-post');

    const el = template.content.cloneNode(true);
    console.log(el);
    // el.dataset = el.dataset || {};
    // el.dataset.id = postId;
    // console.log(el.dataset.id);
    const container = el.querySelector(`[class='container']`);
    container.setAttribute('data-id', postId);
    console.log(container);

    const blogTitle = el.getElementById('blog-title');
    console.log(blogTitle);
    blogTitle.textContent = post.title;

    const blogDate = el.getElementById('blog-date');
    blogDate.textContent = post.date;

    const blogSummary = el.getElementById('blog-summary');
    blogSummary.textContent = post.summary;

    const editBtn = el.getElementById('edit-btn');
    //editBtn.addEventListener('click', editPost);

    const deleteBtn = el.getElementById('delete-btn');
    //deleteBtn.addEventListener('click', removePost(postId));
    console.log(deleteBtn);

    const saveBtn = el.getElementById('save-btn');
    console.log(saveBtn);
    //saveBtn.addEventListener('click', savePost(postId));
    saveBtn.style.display = 'none';
    
    postContainer.appendChild(el);
    
    return container;
}

function attachEventListeners(postElement) {
    const postId = postElement.getAttribute('data-id');
    console.log(document.querySelector(`[data-id="${postId}"]`));
    const editBtn = postElement.querySelector(`#edit-btn`);
    //console.log(editBtn.parentElement);
    const deleteBtn = postElement.querySelector(`#delete-btn`);
    const saveBtn = postElement.querySelector(`#save-btn`);
    editBtn.addEventListener('click', editPost);
    deleteBtn.addEventListener('click', removePost);
    saveBtn.addEventListener('click', savePost);
}

function renderPost(postId, post) {
    const postContainer = document.getElementById('post-container');
    let el = createPost(postId, post);
    console.log(post);
   // console.log(post.dataset.id);
    //postContainer.appendChild(el);
   // console.log(el);
    //console.log(document.querySelector('data-id'));
    attachEventListeners(el);
}

function editPost(event) {
    console.log(`edit post`);
    event.target.style.display = 'none';
    const postToEdit = event.target.parentElement;
    console.log(postToEdit);
    const saveBtn = postToEdit.querySelector(`#save-btn`);
    saveBtn.style.display = 'inline';
    const titleToEdit = postToEdit.querySelector(`#blog-title`);
    const dateToEdit = postToEdit.querySelector(`#blog-date`);
    const summaryToEdit = postToEdit.querySelector(`#blog-summary`);
    titleToEdit.contentEditable = true;
    dateToEdit.contentEditable = true;
    summaryToEdit.contentEditable = true;
}

function savePost(event) {
    console.log(`save post`);
    console.log(event.target.parentElement);
    const postToSave = event.target.parentElement;
    const postId = postToSave.getAttribute('data-id');
    console.log(postId);
    // console.log(postToSave);
    // if (postToSave != null) {
    const editBtn = postToSave.querySelector(`#edit-btn`);
    const saveBtn = postToSave.querySelector(`#save-btn`);
    const titleToSave = postToSave.querySelector(`#blog-title`);
    console.log(titleToSave.innerHTML);
    const dateToSave = postToSave.querySelector(`#blog-date`);
    const summaryToSave = postToSave.querySelector(`#blog-summary`);
    console.log(summaryToSave.value);
    const newPost = {
        title: titleToSave.innerHTML,
        date: dateToSave.innerHTML,
        summary: summaryToSave.innerHTML
    };
    console.log(newPost);
    updatePost(postId, newPost);
    titleToSave.contentEditable = false;
    dateToSave.contentEditable = false;
    summaryToSave.contentEditable = false;
    saveBtn.style.display = 'none';
    editBtn.style.display = 'inline';
    //console.log(currentPosts);
}

function removePost(event) {
    const postToDelete = event.target.parentElement;
    const postId = postToDelete.getAttribute('data-id');
    // const postToDelete = document.querySelector(`[data-id="${postId}"]`);
    deletePost(postId);
    postToDelete.remove();
    //console.log(currentPosts);
}