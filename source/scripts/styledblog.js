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

        let postId = insertPost(post);
        newPostModal.close();
        //Clear form fields after submit
        newPostForm.reset();
        renderPost(postId, post);
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
    const postContainer = document.getElementById('post-container');
    const template = document.getElementById('blog-post');

    const el = template.content.cloneNode(true);
    const container = el.querySelector(`[class='container']`);
    container.setAttribute('data-id', postId);

    const blogTitle = el.getElementById('blog-title');
    blogTitle.textContent = post.title;

    const blogDate = el.getElementById('blog-date');
    blogDate.textContent = post.date;

    const blogSummary = el.getElementById('blog-summary');
    blogSummary.textContent = post.summary;

    const saveBtn = el.getElementById('save-btn');
    saveBtn.style.display = 'none';
    
    postContainer.appendChild(el);
    
    return container;
}

function attachEventListeners(postElement) {
    const editBtn = postElement.querySelector(`#edit-btn`);
    const deleteBtn = postElement.querySelector(`#delete-btn`);
    const saveBtn = postElement.querySelector(`#save-btn`);
    editBtn.addEventListener('click', editPost);
    deleteBtn.addEventListener('click', removePost);
    saveBtn.addEventListener('click', savePost);
}

function renderPost(postId, post) {
    let el = createPost(postId, post);
    attachEventListeners(el);
}

function editPost(event) {
    console.log(`edit post`);
    event.target.style.display = 'none';
    const postToEdit = event.target.parentElement;
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
    const postToSave = event.target.parentElement;
    const postId = postToSave.getAttribute('data-id');
    const editBtn = postToSave.querySelector(`#edit-btn`);
    const saveBtn = postToSave.querySelector(`#save-btn`);
    const titleToSave = postToSave.querySelector(`#blog-title`);
    const dateToSave = postToSave.querySelector(`#blog-date`);
    const summaryToSave = postToSave.querySelector(`#blog-summary`);
    const newPost = {
        title: titleToSave.innerHTML,
        date: dateToSave.innerHTML,
        summary: summaryToSave.innerHTML
    };
    updatePost(postId, newPost);
    titleToSave.contentEditable = false;
    dateToSave.contentEditable = false;
    summaryToSave.contentEditable = false;
    saveBtn.style.display = 'none';
    editBtn.style.display = 'inline';
}

function removePost(event) {
    console.log(`delete post`);
    const postToDelete = event.target.parentElement;
    const postId = postToDelete.getAttribute('data-id');
    deletePost(postId);
    postToDelete.remove();
}