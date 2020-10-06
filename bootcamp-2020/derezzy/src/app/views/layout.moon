html = require "lapis.html"

class extends html.Widget
    content: =>
        html_5 ->
            head ->
                title @title or "Derezzy"
                link rel: "stylesheet", href: @build_url "static/css/style.css"
                link rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"
                script src: @build_url "static/js/jquery-3.5.1.min.js"
            body ->
                @content_for "inner"
