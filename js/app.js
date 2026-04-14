
//Get HTML elements
const tabList = document.getElementById('tabList');
const tabContent = document.getElementById('tabContent');

// Search field
const searchBtn = document.getElementById('searchButt');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const sidebar = document.getElementById("sidebar");

// Views
const listView = document.getElementById('listView');
const tabViewer = document.getElementById('tabViewer');
const loginView = document.getElementById('loginView');
const registerView = document.getElementById('registerView');
const profileView = document.getElementById('profileView');

// Buttons
const backBtn = document.getElementById('backToList');
const printBtn = document.getElementById('printTab');
const loginBtn = document.getElementById('loginBtn');
const loginBackBtn = document.getElementById('loginBackBtn');
const showRegister = document.getElementById('showRegister');
const registerBtn = document.getElementById('registerBtn');
const registerBack = document.getElementById('registerBack');
const updateEmailBtn = document.getElementById('updateEmailBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const handleBtn = document.getElementById("handleBtn");
const uploaderBtn = document.getElementById("uploaderBtn");

// Header
const userArea = document.getElementById('userArea');


// Paging, sorting
let allTabs = [];
let currentPage = 1;
let pageSize = 10;
let currentSortColumn = 'song_title';
let currentSortAsc = true;

const pageSizeSelect = document.getElementById('pageSizeSelect');
const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

// upload view (col2 upload butt is runtime!!!!!)
const uploadView = document.getElementById('uploadView');
const uploadBtn = document.getElementById('uploadBtn');
const uploadBackBtn = document.getElementById('uploadBackBtn');
const uploadForm = document.getElementById('uploadForm');

/*Render rating stars
★2505 ☆2506 uni in office!!! */

function renderStars(container, currentRating = 0, tabId = 0) {
    container.innerHTML = '';
    for(let i=1;i<=5;i++){
        const star = document.createElement('span');
        star.textContent = '★';
        star.style.cursor = 'pointer';
        star.style.color = i <= currentRating ? 'gold' : '#ccc';
        star.addEventListener('click', async () => {
            // save rating
            await fetch('api/rate_tab.php', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({tab_id: tabId, rating:i})
            });
            // update UI
            renderStars(container, i, tabId);
        });
        container.appendChild(star);
    }
}

// VIEW MANAGEMENT

/*Hide all views in content area (col right / 3)*/
function hideAllViews() {
    listView.style.display = 'none';
    tabViewer.style.display = 'none';
    loginView.style.display = 'none';
    registerView.style.display = 'none';
    uploadView.style.display = 'none';
    profileView.style.display = 'none';
}

// Reset input fields and errors for login
function resetLoginView() {
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').textContent = '';
}

// Reset input fields and errors for register
function resetRegisterView() {
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerError').textContent = '';
}

// Main function to show a selected view
function showView(viewName) {
    hideAllViews();

    const tabsTitle = document.getElementById('tabsTitle');

    switch(viewName) {
        case 'list':
            listView.style.display = 'block';
            tabsTitle.style.display = 'block'; //show
            break;

        case 'tab':
            tabViewer.style.display = 'block';
            tabsTitle.style.display = 'block'; //show
            break;

        case 'login':
            resetLoginView();
            loginView.style.display = 'block';
            tabsTitle.style.display = 'none'; //hide
            break;

        case 'register':
            resetRegisterView();
            registerView.style.display = 'block';
            tabsTitle.style.display = 'none'; 
            break;

        case 'upload':
            uploadView.style.display = 'block';
            tabsTitle.style.display = 'none'; 
            break;
        case 'profile':
            profileView.style.display = 'block';
            tabsTitle.style.display = 'none';
            break;
    }
}

// RENDERING TABLES

/*Render table with sorting and paging*/

function renderTable() {

    // Sort
    allTabs.sort((a,b) => {
        let valA = a[currentSortColumn] || '';
        let valB = b[currentSortColumn] || '';
        if(valA < valB) return currentSortAsc ? -1 : 1;
        if(valA > valB) return currentSortAsc ? 1 : -1;
        return 0;
    });

    // Page
    let total = allTabs.length;
    let totalPages = pageSize === -1 ? 1 : Math.ceil(total / pageSize);
    if(currentPage > totalPages) currentPage = totalPages;
    if(currentPage < 1) currentPage = 1;

    let start = pageSize === -1 ? 0 : (currentPage - 1) * pageSize;
    let end = pageSize === -1 ? total : start + pageSize;
    const pageTabs = allTabs.slice(start,end);

    tabList.innerHTML = '';

    pageTabs.forEach(tab => {
        const row = document.createElement('tr');

        // Title
        const titleCell = document.createElement('td');
        titleCell.textContent = tab.song_title;
        titleCell.style.cursor = 'pointer';
        titleCell.addEventListener('click', () => loadTab(tab.tab_id));
        row.appendChild(titleCell);

        // artist
        const artistCell = document.createElement('td');
        artistCell.textContent = tab.artist_name;
        artistCell.style.cursor = 'pointer';
        artistCell.style.color = 'blue';
        artistCell.addEventListener('click', () => searchTabs(tab.artist_name));
        row.appendChild(artistCell);

        // Rating (ver 3)
        const ratingCell = document.createElement('td');

        if (tab.rating) {
            const value = parseFloat(tab.rating);
            const stars = Math.round(value);

            let starString = '';
            for (let i = 1; i <= 5; i++) {
                starString += i <= stars ? '★' : '☆';
            }

            ratingCell.textContent = `${starString} ${value.toFixed(1)}`;
        } else {
            ratingCell.textContent = '-';
        }

        row.appendChild(ratingCell);
        tabList.appendChild(row);
    });

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

// EVENT LISTENERS (BUTTONS etc.)

// Table header sorting
document.querySelectorAll('#tabListTable th').forEach(th => {
    th.addEventListener('click', () => {
        const col = th.dataset.column;
        if(currentSortColumn === col) currentSortAsc = !currentSortAsc;
        else { currentSortColumn = col; currentSortAsc = true; }
        renderTable();
    });
});

// Paging
prevPage.addEventListener('click', () => { currentPage--; renderTable(); });
nextPage.addEventListener('click', () => { currentPage++; renderTable(); });
pageSizeSelect.addEventListener('change', () => {
    pageSize = parseInt(pageSizeSelect.value);
    currentPage = 1;
    renderTable();
});

// Search butt
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    searchTabs(query);
    sidebar.classList.remove("active");
});

//Search with enter
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        searchTabs(query);
        sidebar.classList.remove("active");
    }
});

//Search eraser (clear butt)
clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    searchTabs('');
    searchInput.focus();
});

// Back butt from tab view
backBtn.addEventListener('click', () => showView('list'));

// Print tab
printBtn.addEventListener('click', () => window.print());

// Login view back butt
loginBackBtn.addEventListener('click', () => showView('list'));

// Show register view butt
showRegister.addEventListener('click', () => showView('register'));

// Register view back butt
registerBack.addEventListener('click', () => showView('login'));

//Uploader butt
uploaderBtn.addEventListener('click', () => {
                    hideAllViews();
                    uploadView.style.display = 'block';
                });

// Mobile sidebar pop-up butt
handleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
});

// ASYNC FUNCTIONS

/*Profile view - load profile info*/
async function loadProfile() {
    const res = await fetch('api/profile.php');
    const data = await res.json();

    document.getElementById('profileUsername').textContent = data.username;
    document.getElementById('profileEmail').value = data.email;

    const container = document.getElementById('userTabs');
container.innerHTML = '';

//Load user-uploaded tabs (if any) with delete button
data.tabs.forEach(tab => {
    const row = document.createElement('div');
    row.className = 'tab-row';

    const text = document.createElement('span');
    text.textContent = `${tab.song_title} - ${tab.artist_name}`;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'delete';
    delBtn.className = 'btn btn-dark';

    delBtn.addEventListener('click', async () => {
        await fetch('api/delete_tab.php', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({tab_id: tab.tab_id})
        });
        loadProfile();
    });

    row.appendChild(text);
    row.appendChild(delBtn);
    container.appendChild(row);
});
}

// Search tabs
async function searchTabs(query) {
    try {
        const url = query ? `api/tabs.php?search=${encodeURIComponent(query)}` : 'api/tabs.php';
        const response = await fetch(url);
        allTabs = await response.json();
        currentPage = 1;
        renderTable();
        tabContent.innerHTML = '';
        showView('list');
    } catch(err) {
        console.error('Error fetching tabs:', err);
    }
}

// Load single tab
async function loadTab(id) {
    try {
        const response = await fetch(`api/tabs.php?id=${id}`);
        const tab = await response.json();

        tabContent.innerHTML = '';

        if(!tab || !tab.tablature) {
            tabContent.textContent = 'Tab not found.';
            return;
        }

        // Title
        const title = document.createElement('h3');
        title.textContent = `${tab.song_title} by ${tab.artist_name}`;
        tabContent.appendChild(title);

        // average rating
        const avgRating = document.createElement('div');
        avgRating.style.marginBottom = '5px';

        if (tab.rating) {
            const value = parseFloat(tab.rating);
            const stars = Math.round(value);

            let starString = '';
            for (let i = 1; i <= 5; i++) {
                starString += i <= stars ? '★' : '☆';
            }

            avgRating.textContent = `Average: ${starString} ${value.toFixed(1)}`;
        } else {
            avgRating.textContent = 'No ratings yet';
        }

        tabContent.appendChild(avgRating);

        // User rating (ver3 interactive)
        const ratingDiv = document.createElement('div');
        ratingDiv.style.marginBottom = '10px';

        renderStars(ratingDiv, tab.user_rating || 0, tab.tab_id);

        tabContent.appendChild(ratingDiv);

        // Tab text (div/pre?)
        const pre = document.createElement('pre');
        pre.textContent = tab.tablature;

        const wrapper = document.createElement('div');
        wrapper.className = 'tabWrapper';
        wrapper.appendChild(pre);

        tabContent.appendChild(wrapper);

        showView('tab');

    } catch(err) {
        console.error('Error loading tab:', err);
    }
}
// Login butt
loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('api/auth.php?action=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const result = await response.json();

    if(result.success) {
        showView('list');
        updateUserHeader();
    } else {
        document.getElementById('loginError').textContent = "Invalid login";
        document.getElementById('loginPassword').value = ''; // clear password
    }
});

// Register button
registerBtn.addEventListener('click', async () => {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;

    //console.log(username, email, password);

    // validate if required fields are not empty
    if (!username || !email || !password) {
        document.getElementById('registerError').textContent = "All fields required";
        return;
    }

    // simple email regex, check if address format is valid
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) {
        document.getElementById('registerError').textContent = "Invalid email format";
        return;
    }
    //console.log(username, email, password);
    const response = await fetch('api/auth.php?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
    });
    const result = await response.json();

    if(result.success) {
        resetRegisterView();
        document.getElementById('loginError').textContent = "Account created. Please login.";
        showView('list');
    } else {
        document.getElementById('registerError').textContent = result.message || "Registration failed";
        document.getElementById('registerPassword').value = '';
    }
});
//Profile - update email butt
updateEmailBtn.addEventListener('click', async () => {
    const email = document.getElementById('profileEmail').value;

    await fetch('api/update_email.php', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({email})
    });

    loadProfile();
});
// Profile - delete profil (account) butt
deleteAccountBtn.addEventListener('click', async () => {
    if (!confirm("Are you sure?")) return;

    await fetch('api/delete_account.php', { method: 'POST' });

    window.location.reload();
});

// upload button (submit in upload view NOT UPLOAD TAB button in col2!!!)
uploadBtn.addEventListener('click', async () => {

    const artist = document.getElementById('uploadArtistName').value.trim();
    const title = document.getElementById('uploadSongTitle').value.trim();
    const type = document.getElementById('uploadType').value;
    const tab = document.getElementById('uploadTablature').value.trim();

    if (!artist || !title || !tab) {

    document.getElementById('uploadMessage').textContent = "All fields required";
    return;

    }

const response = await fetch('api/upload_tab.php', {

    method: 'POST',
    headers: { 'Content-Type':'application/json' },

    body: JSON.stringify({

        artist_name: artist,
        song_title: title,
        tablature: tab,
        type: type

    })

});

const result = await response.json();

document.getElementById('uploadMessage').textContent = result.message;

    if (result.success) {

        uploadForm.reset();

        hideAllViews();
        listView.style.display = 'block';

        searchTabs('');

    }

});
// Upload back butt
uploadBackBtn.addEventListener('click', () => {

    uploadForm.reset();
    document.getElementById('uploadMessage').textContent = '';

    hideAllViews();
    listView.style.display = 'block';

});
// Search input field and dropdown
searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    if(!query) return;

    const response = await fetch(`api/tabs.php?search=${encodeURIComponent(query)}`);
    const tabs = await response.json();

    // remove existing dropdown
    let dropdown = document.getElementById('autocompleteList');
    if(dropdown) dropdown.remove();

    dropdown = document.createElement('div');
    dropdown.id = 'autocompleteList';
    dropdown.style.position = 'absolute';
    dropdown.style.background = 'white';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.zIndex = 1000;
    dropdown.style.width = searchInput.offsetWidth + 'px';

    tabs.forEach(tab => {
        const item = document.createElement('div');
        item.textContent = `${tab.song_title} — ${tab.artist_name}`;
        item.style.padding = '3px 5px';
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            searchInput.value = tab.song_title;
            searchTabs(tab.song_title);
            dropdown.remove();
        });
        dropdown.appendChild(item);
    });

    searchInput.parentNode.appendChild(dropdown);
});

// removing dropdown if clicked outside of search or dropdown
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('autocompleteList');
    if(dropdown && !searchInput.contains(e.target)){
        dropdown.remove();
    }
});


//HEADER FUNCTIONS (Title, login/logout)

async function updateUserHeader() {
    try {
        const response = await fetch('api/auth.php?action=status');
        const data = await response.json();

        // Clear header first
        userArea.innerHTML = '';

        if (data.loggedIn) {

            //Username - Show profile butt
            const profileBtn = document.createElement('button');
            profileBtn.textContent = data.username;
            profileBtn.className = 'btn btn-light';

            profileBtn.addEventListener('click', () => {
                showView('profile');
                 loadProfile(); 
            });

            //Logout button
            const logoutBtn = document.createElement('button');
            logoutBtn.textContent = 'logout';
            logoutBtn.className = 'btn btn-light';

            logoutBtn.addEventListener('click', logoutUser);

            // SHow on header
            userArea.appendChild(profileBtn);
            userArea.appendChild(logoutBtn);

        } else {

            // Login button
            const loginBtn = document.createElement('button');
            loginBtn.textContent = 'login';
            loginBtn.className = 'btn btn-light';

            loginBtn.addEventListener('click', () => showView('login'));

            // Register button
            const registerBtn = document.createElement('button');
            registerBtn.textContent = 'register';
            registerBtn.className = 'btn btn-light';

            registerBtn.addEventListener('click', () => showView('register'));

        
            userArea.appendChild(loginBtn);
            userArea.appendChild(registerBtn);
        }

    } catch (err) {
        console.error("Header update failed:", err);
    }
}
/* Logout with fail-safe function so logout happens before reload */
async function logoutUser() {

    try {
        await fetch('api/auth.php?action=logout', { method:'POST' });
    } catch (err) {
        console.error("Logout error:", err);
    }

    window.location.reload();

}
// Highlight rating stars
function highlightStars(container, upTo){

const stars = container.querySelectorAll('span');

    stars.forEach(star => {

        star.textContent = star.dataset.value <= upTo ? '★' : '☆';

    });


}

// INIT LOADER

searchTabs('');
// Header update
updateUserHeader();
