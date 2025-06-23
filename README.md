[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/vS16JFW6)

# Homework 1 -- Phreddit (Phake Reddit with HTML/CSS/JavaScript )

**Remember to list your contribution in the sections shown below before the due date.**

## Team Member 1 contribution

<Yaseen Maqsudi>
- Created Navbar Component
- Home button, create community button, list of all communities
- All css requirements met, updated createNavbar() and updateCommunityList()

- Created home page view component with functional buttons and correct styling
- Created 3 helper functions for displaying posts and sorting them

- Finished Community page view

  - Completed renderCommunityView()
  - Changed createPostElement()
  - Completed sortCommunityPosts()

- Finished Search results page

  - Finished renderSearchResultsView() function
  - Finished sortSearchResults() function
  - Changed bannerEvents() to allow user to search when hitting 'enter' key

- Finished createPostElement() function

## Team Member 2 contribution

<Gavin Levitt>
- created and styled banner elements
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
