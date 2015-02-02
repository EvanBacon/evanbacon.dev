# A Meteor Image Gallery Application

A responsive, easy-to-use image gallery manager and showcase platform built with MeteorJS. 

## Features
* Admin Gallery Dashboard
* Fluid and filterable layouts with Isotope/Packery
* Option to shuffle or specify the order of album images using jQuery's Sortable
* Drag and drop re-ordering
* Edit individual image meta data and image tags.
* Creates various image sizes for load optimization
* Responsive design

And there's still room for improvement...


## Installation 

- Install Meteor (<http://www.meteor.com>)
- Install [GraphicsMagick](http://www.graphicsmagick.org/) or [ImageMagick](http://www.imagemagick.org/script/index.php) on your development machine or the server that will host your app.
- Clone this repo: `git clone https://github.com/nelfarna/meteor-image-gallery.git`.
- Run the app

```sh
$ meteor
```
- Go to http://localhost:3000/ and start uploading images and creating albums.


## How to Use

- Set environmental variables for sending email (forgotten password, contact form, etc.):
  - SMTP_EMAIL - eg: username@gmail.com'
  - SMTP_PASSWORD
  - SMTP_SERVER - eg: smtp.gmail.com
  - SMTP_PORT - eg: 465

- Click on Sign In link which will redirect you to the registration page (first time only for new admin)
- After creating an admin account, sign in with the new credentials and configure site settings: logo url, image sizes, about page and footer code, contact email etc.
- Upload images and edit meta data / tags (do this quickly by selecting the list icon on the Images page)
- Create albums by either selecting images on Images page and selecting 'Create Album' from dropdown list, or from the Albums page click '+ New Album'


## Notes

- Although this application reduces image size and quality on upload, better site performance can be achieved by optimizing images before uploading.
