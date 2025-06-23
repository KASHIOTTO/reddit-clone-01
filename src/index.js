import Model from "./model.js";

let model;
window.onload = function () {
  // fill me with relevant code
  model = new Model();
  window.M = model;

  layout();
  bannerEvents();
  renderHomeView();
};

function layout() {
  const main = document.getElementById("main");
  const container = document.createElement("div");
  container.id = "container";

  const nav = createNavBar();
  container.appendChild(nav);
  container.appendChild(main);

  const header = document.getElementById("header");
  header.insertAdjacentElement("afterend", container);
}

function createNavBar() {
  const nav = document.createElement("div");
  nav.id = "navbar";

  const homeLink = document.createElement("a");
  homeLink.href = "#";
  homeLink.id = "nav_home";
  homeLink.textContent = "Home";
  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    renderHomeView();
  });
  nav.appendChild(homeLink);

  const delim = document.createElement("span");
  delim.className = "vertical-delimiter";
  nav.appendChild(delim);

  const createCommunityBtn = document.createElement("button");
  createCommunityBtn.id = "create_community";
  createCommunityBtn.textContent = "Create Community";
  createCommunityBtn.addEventListener("click", () => {
    renderNewCommunityView();
  });
  nav.appendChild(createCommunityBtn);

  const commHeader = document.createElement("h3");
  commHeader.textContent = "Communities";
  nav.appendChild(commHeader);

  const commList = document.createElement("ul");
  commList.id = "community_list";
  updateCommunityList(commList);
  nav.appendChild(commList);

  return nav;
}

function bannerEvents() {
  const siteTitle = document.getElementById("site_title");
  siteTitle.addEventListener("click", (e) => {
    e.preventDefault();
    renderHomeView();
  });

  const createPostBtn = document.getElementById("create_post");
  createPostBtn.addEventListener("click", () => {
    renderNewPostView();
  });

  const searchBox = document.getElementById("search_box");
  searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = searchBox.value.trim();
      if (query) {
        renderSearchResultsView(query);
      }
    }
  });
}

function updateCommunityList(commListElements) {
  commListElements.innerHTML = "";
  model.data.communities.forEach((community) => {
    const listItem = document.createElement("li");
    const commLink = document.createElement("a");
    commLink.href = "#";
    commLink.textContent = community.name;
    commLink.addEventListener("click", (e) => {
      e.preventDefault();
      renderCommunityView(community.communityID);
    });

    listItem.appendChild(commLink);
    commListElements.appendChild(listItem);
  });
}

function renderHomeView() {
  const main = document.getElementById("main");
  main.innerHTML = ""; // clear previous content
  main.style.overflowY = "auto"; // scrollbar

  const homeContainer = document.createElement("div");
  homeContainer.id = "home_page";

  // header section
  const headerSection = document.createElement("div");
  headerSection.id = "home_header";

  //top *****************
  const topSection = document.createElement("div");
  topSection.id = "top_header";
  //****************************
  const title = document.createElement("h2");
  title.textContent = "All Posts";
  title.id = "all_posts_title";

  // sorting buttons
  const sortContainer = document.createElement("div");
  sortContainer.id = "sort_buttons";

  const newestBtn = document.createElement("button");
  newestBtn.textContent = "Newest";
  newestBtn.id = "sort_newest";
  newestBtn.className = "sort_button";
  newestBtn.onclick = () => sortPosts("newest");

  const oldestBtn = document.createElement("button");
  oldestBtn.textContent = "Oldest";
  oldestBtn.id = "sort_oldest";
  oldestBtn.className = "sort_button";
  oldestBtn.onclick = () => sortPosts("oldest");

  const activeBtn = document.createElement("button");
  activeBtn.textContent = "Active";
  activeBtn.id = "sort_active";
  activeBtn.className = "sort_button";
  activeBtn.onclick = () => sortPosts("active");

  sortContainer.appendChild(newestBtn);
  sortContainer.appendChild(oldestBtn);
  sortContainer.appendChild(activeBtn);

  //bottom ***********************
  const bottomSection = document.createElement("div");
  bottomSection.id = "bottom_header";
  //******************************
  // post Count
  const postCount = document.createElement("p");
  postCount.id = "post_count";
  postCount.textContent = `${model.data.posts.length} posts`;

  headerSection.append(topSection);
  headerSection.append(bottomSection);
  topSection.appendChild(title);
  topSection.appendChild(sortContainer);
  bottomSection.appendChild(postCount); // placed below other header elements

  // separator line
  const headerDelimiter = document.createElement("hr");
  headerDelimiter.className = "header_delimiter";

  // post listing
  const postList = document.createElement("div");
  postList.id = "post_list";

  const sortedPosts = getSortedPosts("newest");
  sortedPosts.forEach((post) => {
    postList.appendChild(createPostElement(post));
  });

  // add to home container on main
  homeContainer.appendChild(headerSection);
  homeContainer.appendChild(headerDelimiter);
  homeContainer.appendChild(postList);
  main.appendChild(homeContainer);
}

// helper function to sort the posts based on newest, oldest, and active

function sortPosts(order) {
  const postList = document.getElementById("post_list");
  postList.innerHTML = "";

  const sortedPosts = getSortedPosts(order);
  sortedPosts.forEach((post) => {
    postList.appendChild(createPostElement(post));
  });

  // update post count
  document.getElementById(
    "post_count"
  ).textContent = `${sortedPosts.length} posts`;
}

function getSortedPosts(order) {
  let sortedPosts = [...model.data.posts];

  if (order === "newest") {
    sortedPosts.sort((a, b) => b.postedDate - a.postedDate);
  } else if (order === "oldest") {
    sortedPosts.sort((a, b) => a.postedDate - b.postedDate);
  } else if (order === "active") {
    sortedPosts.sort((a, b) => {
      const lastCommentA = getLastCommentDate(a.commentIDs);
      const lastCommentB = getLastCommentDate(b.commentIDs);
      return lastCommentB - lastCommentA;
    });
  }

  return sortedPosts;
}

function getLastCommentDate(commentIDs) {
  if (!commentIDs.length) return new Date(0); // if no comments, return oldest possible date
  return Math.max(
    ...commentIDs.map(
      (id) =>
        model.data.comments.find((c) => c.commentID === id)?.commentedDate ||
        new Date(0)
    )
  );
}

function createPostElement(post, showCommunityName = true) {
  const postElement = document.createElement("div");
  postElement.className = "post";

  const metaInfo = document.createElement("p");
  const community = model.data.communities.find((c) =>
    c.postIDs.includes(post.postID)
  );

  if (showCommunityName) {
    metaInfo.innerHTML = `<strong>${
      community ? community.name : "Unknown Community"
    }</strong> | ${post.postedBy} | ${timestamp(post.postedDate)}`;
  } else {
    metaInfo.innerHTML = `${post.postedBy} | ${timestamp(post.postedDate)}`;
  }
  postElement.appendChild(metaInfo);

  const title = document.createElement("h3");
  title.textContent = post.title;
  title.className = "post_title";
  postElement.appendChild(title);

  if (post.linkFlairID) {
    const flair = model.data.linkFlairs.find(
      (f) => f.linkFlairID === post.linkFlairID
    );
    if (flair) {
      const flairTag = document.createElement("span");
      flairTag.className = "post_flair";
      flairTag.textContent = flair.content;
      postElement.appendChild(flairTag);
    }
  }

  const contentPreview = document.createElement("p");
  contentPreview.textContent = post.content.substring(0, 20) + "...";
  contentPreview.className = "post_preview";
  postElement.appendChild(contentPreview);

  const stats = document.createElement("div");
  stats.className = "post_stats";
  stats.innerHTML = `<span>Views: ${post.views}</span> | <span>Comments: ${post.commentIDs.length}</span>`;
  postElement.appendChild(stats);

  postElement.addEventListener("click", () => renderPostView(post.postID));

  return postElement;
}

function renderPostView(postID) {
  const main = document.getElementById("main");
  main.innerHTML = "";

  //retrieve matching post from post arr
  const post = model.data.posts.find((p) => p.postID === postID);
  if (!post) {
    main.textContent = "Post not found.";
    return;
  }
  post.views = post.views + 1;

  //get post source comm
  const postHeader = document.createElement("div");
  postHeader.className = "post_header";
  let communityName = "";
  model.data.communities.forEach((comm) => {
    if (comm.postIDs.includes(post.postID)) {
      communityName = comm.name;
    }
  });

  //first line of header
  const firstLine = document.createElement("p");
  firstLine.textContent = `${communityName} | ${timestamp(post.postedDate)}`;
  postHeader.appendChild(firstLine);

  //second line of header/user
  const user = document.createElement("p");
  user.id = "posted_by";
  user.textContent = `Posted by: ${post.postedBy}`; //ERROR !!!!!!!!!!!!!!
  postHeader.appendChild(user);

  //third line/name of post
  const postTitle = document.createElement("p");
  postTitle.id = "post_title";
  postTitle.textContent = post.title;
  postHeader.appendChild(postTitle);

  //possible flair line/ #4
  if (post.linkFlairID) {
    const flairElement = model.data.linkFlairs.find(
      (lf) => lf.linkFlairID === post.linkFlairID
    );
    if (flairElement) {
      const flair = document.createElement("span");
      flair.className = "link_flair";
      flair.textContent = flairElement.content;
      postHeader.appendChild(flair);
    }
  }

  //post content
  const contentOfPost = document.createElement("p");
  contentOfPost.textContent = post.content;
  postHeader.appendChild(contentOfPost);

  //stats
  const stats = document.createElement("p");
  stats.id = "post_stats";
  stats.textContent = `Views: ${post.views} | Comments: ${post.commentIDs.length}`;
  postHeader.appendChild(stats);

  //comment button
  const commentBtn = document.createElement("button");
  commentBtn.id = "comment_button";
  commentBtn.textContent = "Add a comment";
  commentBtn.addEventListener("click", () => {
    renderNewCommentView(post.postID); // renderNewCommentView !!!!
  });
  postHeader.appendChild(commentBtn);
  main.appendChild(postHeader);
  //delimiter
  const postDelimeter = document.createElement("hr");
  main.appendChild(postDelimeter);

  //comment section **********
  const commentSection = document.createElement("div");
  commentSection.id = "comment_section";

  post.commentIDs.slice().forEach((commentID) => {
    const commentObject = model.data.comments.find(
      (c) => c.commentID === commentID
    );
    if (commentObject) {
      const commentElement = renderComment(commentObject, 0, post.postID);
      commentSection.appendChild(commentElement);
    }
  });
  main.appendChild(commentSection);
}
function renderComment(comment, position, postID) {
  const reply = document.createElement("div");
  reply.style.marginLeft = position + 0.25 + "in";
  reply.className = "comment";

  const header = document.createElement("p");
  header.className = "comm_header";
  header.textContent = `${comment.commentedBy} | ${timestamp(
    comment.commentedDate
  )}`;
  reply.appendChild(header);

  const commContent = document.createElement("p");
  commContent.className = "comm_cont";
  commContent.textContent = `${comment.content}`;
  reply.appendChild(commContent);

  const replyBtn = document.createElement("button");
  replyBtn.className = "reply_button";
  replyBtn.textContent = "Reply";
  replyBtn.addEventListener("click", () => {
    renderNewCommentView(postID, comment.commentID); // newCommentView !!!
  });
  reply.appendChild(replyBtn);

  if (comment.commentIDs && comment.commentIDs.length > 0) {
    comment.commentIDs.slice().forEach((childID) => {
      const childComm = model.data.comments.find(
        (c) => c.commentID === childID
      );
      if (childComm) {
        const childElement = renderComment(childComm, position, postID);
        reply.appendChild(childElement);
      }
    });
  }
  return reply;
}

function renderNewCommentView(postID, op = null) {
  const main = document.getElementById("main");
  main.innerHTML = "";

  const form = document.createElement("form");
  form.id = "reply_form";

  const comment = document.createElement("label");
  comment.textContent = "Content: *";
  form.appendChild(comment);

  const commentInput = document.createElement("textarea");
  commentInput.className = "comment_input";
  commentInput.maxLength = 500;
  commentInput.required = true;
  form.appendChild(commentInput);

  const commentError = document.createElement("div");
  commentError.className = "error";
  form.appendChild(commentError);

  const user = document.createElement("label");
  user.textContent = "Username: *";
  form.appendChild(user);

  const userInput = document.createElement("input");
  userInput.className = "user_input";
  userInput.type = "text";
  userInput.required = true;
  form.appendChild(userInput);

  const userError = document.createElement("div");
  userError.className = "error";
  form.appendChild(userError);

  const submit = document.createElement("button");
  submit.textContent = "Submit Comment";
  form.appendChild(submit);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    if (!commentInput.value.trim()) {
      commentError.textContent = "contents of reply required";
      valid = false;
    } else {
      commentError.textContent = "";
    }
    if (!userInput.value.trim()) {
      userError.textContent = "username required";
      valid = false;
    } else {
      userError.textContent = "";
    }
    if (!valid) {
      return;
    }

    const newCommentID = "comment" + (model.data.comments.length + 1);
    const newComment = {
      commentID: newCommentID,
      content: commentInput.value.trim(),
      commentIDs: [],
      commentedBy: userInput.value.trim(),
      commentedDate: new Date(),
    };
    model.data.comments.push(newComment);

    if (op) {
      const parent = model.data.comments.find((c) => c.commentID === op);
      if (parent) {
        parent.commentIDs.push(newCommentID);
      }
    } else {
      const post = model.data.posts.find((p) => p.postID === postID);
      if (post) {
        post.commentIDs.push(newCommentID);
      }
    }
    renderPostView(postID);
  });
  main.appendChild(form);
}

function timestamp(date) {
  const currentTime = new Date();
  const diffMillis = currentTime - new Date(date);
  const diffSec = Math.floor(diffMillis / 1000);
  if (diffSec < 60) {
    return `${diffSec} second(s) ago`;
  }
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} minute(s) ago`;
  }
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) {
    return `${diffHrs} hour(s) ago`;
  }
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 30) {
    return `${diffDays} day(s) ago`;
  }
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths} month(s) ago`;
  }
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year(s) ago`;
}

function renderNewCommunityView() {
  const main = document.getElementById("main");
  main.innerHTML = "";

  const form = document.createElement("form");
  form.id = "new_commform";

  //creating comm name
  const commName = document.createElement("label");
  commName.textContent = "Community Name: *";
  form.appendChild(commName);

  const commNameInput = document.createElement("input");
  commNameInput.className = "comm_name";
  commNameInput.type = "text";
  commNameInput.maxLength = 100;
  commNameInput.required = true;
  form.appendChild(commNameInput);

  const commNameError = document.createElement("div");
  commNameError.className = "error";
  form.appendChild(commNameError);

  //creating comm description
  const desc = document.createElement("label");
  desc.textContent = "Description: *";
  form.appendChild(desc);

  const descrip = document.createElement("textarea");
  descrip.className = "comment_input";
  descrip.maxLength = 500;
  descrip.required = true;
  form.appendChild(descrip);

  const descError = document.createElement("div");
  descError.className = "error";
  form.appendChild(descError);

  //creating user info
  const user = document.createElement("label");
  user.textContent = "Your Username: *";
  form.appendChild(user);

  const userInput = document.createElement("input");
  userInput.className = "user_input";
  userInput.type = "text";
  userInput.required = true;
  form.appendChild(userInput);

  const userError = document.createElement("div");
  userError.className = "error";
  form.appendChild(userError);

  const engender = document.createElement("button");
  engender.textContent = "Engender Community";
  form.appendChild(engender);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    if (!commNameInput.value.trim()) {
      commNameError.textContent = "community name required";
      valid = false;
    } else {
      commNameError.textContent = "";
    }
    if (!descrip.value.trim()) {
      descError.textContent = "description required";
      valid = false;
    } else {
      descError.textContent = "";
    }
    if (!userInput.value.trim()) {
      userError.textContent = "username required";
      valid = false;
    } else {
      userError.textContent = "";
    }
    if (!valid) {
      return;
    }

    const newCommunityID = "community" + (model.data.communities.length + 1);
    const newCommunity = {
      communityID: newCommunityID,
      name: commNameInput.value.trim(),
      description: descrip.value.trim(),
      postIDs: [],
      startDate: new Date(),
      members: [userInput.value.trim()],
      memberCount: 1,
    };
    model.data.communities.push(newCommunity);

    const commList = document.getElementById("community_list");
    updateCommunityList(commList); //update navbar list

    renderCommunityView(newCommunityID);
  });
  main.appendChild(form);
}

function renderCommunityView(communityID) {
  const main = document.getElementById("main");
  main.innerHTML = "";
  main.style.overflowY = "auto";

  const community = model.data.communities.find(
    (c) => c.communityID === communityID
  );
  if (!community) {
    main.textContent = "Community not found.";
    return;
  }

  const communityContainer = document.createElement("div");
  communityContainer.id = "home_page";

  const headerSection = document.createElement("div");
  headerSection.id = "home_header";

  // header
  const topSection = document.createElement("div");
  topSection.id = "top_header";

  const title = document.createElement("h2");
  title.textContent = community.name;
  title.style.color = "#ff4500";

  // sorting buttons
  const sortContainer = document.createElement("div");
  sortContainer.id = "sort_buttons";

  const newestBtn = document.createElement("button");
  newestBtn.textContent = "Newest";
  newestBtn.className = "sort_button";
  newestBtn.onclick = () => sortCommunityPosts(communityID, "newest");

  const oldestBtn = document.createElement("button");
  oldestBtn.textContent = "Oldest";
  oldestBtn.className = "sort_button";
  oldestBtn.onclick = () => sortCommunityPosts(communityID, "oldest");

  const activeBtn = document.createElement("button");
  activeBtn.textContent = "Active";
  activeBtn.className = "sort_button";
  activeBtn.onclick = () => sortCommunityPosts(communityID, "active");

  sortContainer.appendChild(newestBtn);
  sortContainer.appendChild(oldestBtn);
  sortContainer.appendChild(activeBtn);

  const bottomSection = document.createElement("div");
  bottomSection.id = "bottom_header";

  // community Description
  const description = document.createElement("p");
  description.textContent = community.description;
  description.style.fontWeight = "bold";

  // creation time
  const creationTime = document.createElement("p");
  creationTime.textContent = `Created ${timestamp(community.startDate)}`;

  // member count
  const memberCount = document.createElement("p");
  memberCount.textContent = `${community.members.length} members`;

  // post count
  const postCount = document.createElement("p");
  postCount.id = "post_count";
  postCount.textContent = `${community.postIDs.length} Posts`;

  topSection.appendChild(title);
  topSection.appendChild(sortContainer);
  bottomSection.appendChild(description);
  bottomSection.appendChild(creationTime);
  bottomSection.appendChild(memberCount);
  bottomSection.appendChild(postCount);

  headerSection.appendChild(topSection);
  headerSection.appendChild(bottomSection);

  // separator line
  const headerDelimiter = document.createElement("hr");
  headerDelimiter.className = "header_delimiter";

  // post listing
  const postList = document.createElement("div");
  postList.id = "post_list";

  const sortedPosts = getSortedCommunityPosts(communityID, "newest");
  sortedPosts.forEach((post) =>
    postList.appendChild(createPostElement(post, false))
  );

  communityContainer.appendChild(headerSection);
  communityContainer.appendChild(headerDelimiter);
  communityContainer.appendChild(postList);
  main.appendChild(communityContainer);
}

function sortCommunityPosts(communityID, order) {
  const postList = document.getElementById("post_list");
  postList.innerHTML = "";

  const sortedPosts = getSortedCommunityPosts(communityID, order);
  sortedPosts.forEach((post) =>
    postList.appendChild(createPostElement(post, false))
  );

  document.getElementById(
    "post_count"
  ).textContent = `${sortedPosts.length} Posts`;
}

function getSortedCommunityPosts(communityID, order) {
  const community = model.data.communities.find(
    (c) => c.communityID === communityID
  );
  if (!community) return [];

  let sortedPosts = model.data.posts.filter((p) =>
    community.postIDs.includes(p.postID)
  );

  if (order === "newest") {
    sortedPosts.sort((a, b) => b.postedDate - a.postedDate);
  } else if (order === "oldest") {
    sortedPosts.sort((a, b) => a.postedDate - b.postedDate);
  } else if (order === "active") {
    sortedPosts.sort((a, b) => {
      const lastCommentA = getLastCommentDate(a.commentIDs);
      const lastCommentB = getLastCommentDate(b.commentIDs);
      return lastCommentB - lastCommentA;
    });
  }

  return sortedPosts;
}

function renderSearchResultsView(query) {
  const main = document.getElementById("main");
  main.innerHTML = ""; // Clear previous content
  main.style.overflowY = "auto"; // Enable scrollbar

  const searchTerms = query.toLowerCase().split(/\s+/); // Split search into terms

  // Filter posts that match any search term in title, content, or comments
  const matchedPosts = model.data.posts.filter((post) => {
    // Check title and content
    const titleMatch = searchTerms.some((term) =>
      post.title.toLowerCase().includes(term)
    );
    const contentMatch = searchTerms.some((term) =>
      post.content.toLowerCase().includes(term)
    );

    // Check comments
    const commentMatch = post.commentIDs.some((commentID) => {
      const comment = model.data.comments.find(
        (c) => c.commentID === commentID
      );
      return (
        comment &&
        searchTerms.some((term) => comment.content.toLowerCase().includes(term))
      );
    });

    return titleMatch || contentMatch || commentMatch;
  });

  // Create container
  const searchContainer = document.createElement("div");
  searchContainer.id = "home_page"; // Reuse home page styling

  // Create Header Section
  const headerSection = document.createElement("div");
  headerSection.id = "home_header";

  // Top Header
  const topSection = document.createElement("div");
  topSection.id = "top_header";

  const title = document.createElement("h2");
  if (matchedPosts.length > 0) {
    title.textContent = `Results for: "${query}"`;
  } else {
    title.textContent = `No results found for: "${query}"`;
  }
  title.style.color = "#ff4500";

  // Sorting Buttons
  if (matchedPosts.length > 0) {
    const sortContainer = document.createElement("div");
    sortContainer.id = "sort_buttons";

    const newestBtn = document.createElement("button");
    newestBtn.textContent = "Newest";
    newestBtn.className = "sort_button";
    newestBtn.onclick = () => sortSearchResults(query, "newest");

    const oldestBtn = document.createElement("button");
    oldestBtn.textContent = "Oldest";
    oldestBtn.className = "sort_button";
    oldestBtn.onclick = () => sortSearchResults(query, "oldest");

    const activeBtn = document.createElement("button");
    activeBtn.textContent = "Active";
    activeBtn.className = "sort_button";
    activeBtn.onclick = () => sortSearchResults(query, "active");

    sortContainer.appendChild(newestBtn);
    sortContainer.appendChild(oldestBtn);
    sortContainer.appendChild(activeBtn);
    topSection.appendChild(sortContainer);
  }

  const bottomSection = document.createElement("div");
  bottomSection.id = "bottom_header";

  const postCount = document.createElement("p");
  postCount.id = "post_count";
  postCount.textContent = `${matchedPosts.length} posts`;
  bottomSection.appendChild(postCount);

  topSection.appendChild(title);
  headerSection.appendChild(topSection);
  headerSection.appendChild(bottomSection);

  const headerDelimiter = document.createElement("hr");
  headerDelimiter.className = "header_delimiter";

  const postList = document.createElement("div");
  postList.id = "post_list";

  if (matchedPosts.length > 0) {
    const sortedPosts = getSortedSearchResults(query, "newest");
    sortedPosts.forEach((post) =>
      postList.appendChild(createPostElement(post))
    );
  } else {
    const errorImg = document.createElement("img");
    errorImg.src = "no_results.png";
    errorImg.alt = "No results found";
    errorImg.style.display = "block";
    errorImg.style.margin = "20px auto";
    postList.appendChild(errorImg);
  }

  searchContainer.appendChild(headerSection);
  searchContainer.appendChild(headerDelimiter);
  searchContainer.appendChild(postList);
  main.appendChild(searchContainer);
}

function sortSearchResults(query, order) {
  const postList = document.getElementById("post_list");
  postList.innerHTML = "";

  const sortedPosts = getSortedSearchResults(query, order);
  sortedPosts.forEach((post) => postList.appendChild(createPostElement(post)));

  document.getElementById(
    "post_count"
  ).textContent = `${sortedPosts.length} posts`;
}

function getSortedSearchResults(query, order) {
  const searchTerms = query.toLowerCase().split(/\s+/);

  let matchedPosts = model.data.posts.filter((post) => {
    const titleMatch = searchTerms.some((term) =>
      post.title.toLowerCase().includes(term)
    );
    const contentMatch = searchTerms.some((term) =>
      post.content.toLowerCase().includes(term)
    );

    const commentMatch = post.commentIDs.some((commentID) => {
      const comment = model.data.comments.find(
        (c) => c.commentID === commentID
      );
      return (
        comment &&
        searchTerms.some((term) => comment.content.toLowerCase().includes(term))
      );
    });

    return titleMatch || contentMatch || commentMatch;
  });

  if (order === "newest") {
    matchedPosts.sort((a, b) => b.postedDate - a.postedDate);
  } else if (order === "oldest") {
    matchedPosts.sort((a, b) => a.postedDate - b.postedDate);
  } else if (order === "active") {
    matchedPosts.sort((a, b) => {
      const lastCommentA = getLastCommentDate(a.commentIDs);
      const lastCommentB = getLastCommentDate(b.commentIDs);
      return lastCommentB - lastCommentA;
    });
  }

  return matchedPosts;
}

function renderNewPostView() {
  const main = document.getElementById("main");
  main.innerHTML = "";

  const form = document.createElement("form");
  form.id = "new_post_form";

  const commLabel = document.createElement("label");
  commLabel.textContent = "Community: *";
  form.appendChild(commLabel);

  const commSelect = document.createElement("select");
  commSelect.required = true;
  form.appendChild(commSelect);

  model.data.communities.forEach((community) => {
    const option = document.createElement("option");
    option.value = community.communityID;
    option.textContent = community.name;
    commSelect.appendChild(option);
  });

  const commError = document.createElement("div");
  commError.className = "error";
  form.appendChild(commError);

  const titleLabel = document.createElement("label");
  titleLabel.textContent = "Title: *";
  form.appendChild(titleLabel);

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.maxLength = 100;
  titleInput.required = true;
  form.appendChild(titleInput);

  const titleError = document.createElement("div");
  titleError.className = "error";
  form.appendChild(titleError);

  const flairLabel = document.createElement("label");
  flairLabel.textContent = "Link Flair (optional):";
  form.appendChild(flairLabel);

  const flairSelect = document.createElement("select");
  flairSelect.innerHTML = `<option value="">None</option>`;
  model.data.linkFlairs.forEach((flair) => {
    const option = document.createElement("option");
    option.value = flair.linkFlairID;
    option.textContent = flair.content;
    flairSelect.appendChild(option);
  });
  form.appendChild(flairSelect);

  const newFlairLabel = document.createElement("label");
  newFlairLabel.textContent = "Or enter a new flair (max 30 chars):";
  form.appendChild(newFlairLabel);

  const newFlairInput = document.createElement("input");
  newFlairInput.type = "text";
  newFlairInput.maxLength = 30;
  form.appendChild(newFlairInput);

  const flairError = document.createElement("div");
  flairError.className = "error";
  form.appendChild(flairError);

  const contentLabel = document.createElement("label");
  contentLabel.textContent = "Content: *";
  form.appendChild(contentLabel);

  const contentInput = document.createElement("textarea");
  contentInput.required = true;
  form.appendChild(contentInput);

  const contentError = document.createElement("div");
  contentError.className = "error";
  form.appendChild(contentError);

  const userLabel = document.createElement("label");
  userLabel.textContent = "Username: *";
  form.appendChild(userLabel);

  const userInput = document.createElement("input");
  userInput.type = "text";
  userInput.required = true;
  form.appendChild(userInput);

  const userError = document.createElement("div");
  userError.className = "error";
  form.appendChild(userError);

  const submitButton = document.createElement("button");
  submitButton.textContent = "Submit Post";
  form.appendChild(submitButton);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let valid = true;

    if (!titleInput.value.trim()) {
      titleError.textContent = "Title is required.";
      valid = false;
    } else {
      titleError.textContent = "";
    }

    if (!contentInput.value.trim()) {
      contentError.textContent = "Content is required.";
      valid = false;
    } else {
      contentError.textContent = "";
    }

    if (!userInput.value.trim()) {
      userError.textContent = "Username is required.";
      valid = false;
    } else {
      userError.textContent = "";
    }

    if (!valid) return;

    let linkFlairID = flairSelect.value;
    if (!linkFlairID && newFlairInput.value.trim()) {
      const newFlairID = "lf" + (model.data.linkFlairs.length + 1);
      const newFlair = {
        linkFlairID: newFlairID,
        content: newFlairInput.value.trim(),
      };
      model.data.linkFlairs.push(newFlair);
      linkFlairID = newFlairID;
    }

    const newPostID = "p" + (model.data.posts.length + 1);
    const newPost = {
      postID: newPostID,
      title: titleInput.value.trim(),
      content: contentInput.value.trim(),
      linkFlairID: linkFlairID || "",
      postedBy: userInput.value.trim(),
      postedDate: new Date(),
      commentIDs: [],
      views: 0,
    };

    model.data.posts.push(newPost);
    const community = model.data.communities.find(
      (c) => c.communityID === commSelect.value
    );
    community.postIDs.push(newPostID);

    renderHomeView();
  });

  main.appendChild(form);
}
