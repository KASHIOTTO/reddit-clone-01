# Mock Reddit Web Application with HTML/CSS/JavaScript

**made in collaboration with Yaseen Maqsudi**

- Community page view

  - renderCommunityView()
  - createPostElement()
  - sortCommunityPosts()

- Search results page

  - renderSearchResultsView() function
  - sortSearchResults() function
  - bannerEvents() allows user to search when hitting 'enter' key

- createPostElement() function
- Banner component and elements
  
  - left-aligned phreddit site title
  - search-box ("Search Phreddit...")
  - create post button that changes to orange when hovered over
- bannerEvents() function
- createNavbar() function
- layout() function
  
  - organized page elements into correct positions
- renderComment() function
  
  - stylized comments and their elements
- renderPostView() function 
  
  - when a post is clicked on in the home or community view, the
    post and its comment section are displayed in main content area
- timestamp() function for tracking time since posted
- renderNewCommentView() function
  
  - forms for replying to posts and other comments
  - stylized elements
  - can be submitted and appear in the post view
  - comment threading 
- renderNewCommunity() function
  
  - creates new community
  - updates listings in navbar
  - initializes community with creator as first member
