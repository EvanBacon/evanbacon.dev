# A Meteor Image Gallery Application

A responsive, easy-to-use image gallery manager and showcase platform built with MeteorJS. 

## Features
* Admin Gallery Dashboard
* Fluid and filterable layouts with Isotope/Packery
* Option to shuffle or specify the order of album images using jQuery's Sortable
* Drag and drop re-ordering
* Edit individual image meta data and image tags.
* Creates various image sizes for load optimization
* Organize images by tags and/or albums
* Responsive design


## Installation 

- Install [Meteor](http://www.meteor.com)
- Install [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/script/index.php) on your development machine or the server that will host your app.
- Clone this repo: `git clone https://github.com/nelfarna/meteor-image-gallery.git`.
- Run the app

```sh
$ meteor
```
- Go to http://localhost:3000/ and register an admin account.
- Login and start setting up the gallery.


## Getting Started

- Set environmental variables for sending email (forgotten password, contact form, etc.):
  - SMTP_EMAIL - eg: username@gmail.com
  - SMTP_PASSWORD
  - SMTP_SERVER - eg: smtp.gmail.com
  - SMTP_PORT - eg: 465 
- The admin manager is accessible through the gray admin toolbar at the top of the page.
-- IMAGES: Upload, edit, delete images. Edit meta data / tags.
-- ALBUMS: Create, edit, delete albums
-- TAGS: Create, edit, delete tags
-- SETTINGS: Edit site settings
- Create albums by either selecting images on the Images page and selecting "Create Album" from Selection dropdown list, or from the Albums page click "New Album"


## Notes

- Although this application reduces image size and quality on upload, faster load times can be achieved by optimizing images before uploading.
