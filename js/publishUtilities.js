function publishFutureEvents() {
    fetch('events/event_publication_schedule.json')
    .then(response => response.json())
    .then(data => {
        // sort events in descending order of expiration
        const sortedData = sortByKey({array:data.events, key:'datetime_expire_et', descending:false});

        var current_section = '';

        sortedData.forEach(event => {

            // get the current local time.  TODO: update so it pulls the UTC time and converts it to NYC time for calculations
            const currentTime = new Date();
            const validTime = new Date(event.datetime_valid_et);
            const expireTime = new Date(event.datetime_expire_et);

            // if in future
            if (currentTime < validTime) {
                if (current_section != validTime.getFullYear()) {
                    current_section = validTime.getFullYear();
                    
                    var hElement = document.createElement('h1');
                    hElement.style = 'text-align: center;';
                    hElement.textContent = current_section;
                    document.getElementById('future_events').appendChild(hElement);

                    var divElement = document.createElement('div');
                    divElement.className = "flex-grid";
                    divElement.id = current_section;
                    document.getElementById('future_events').appendChild(divElement);
                }

                // publish the event to the webpage
                publishEvent({event:event, section:current_section});
            }
        })
    })
    .catch(error => {
        console.error('Error fetching JSON file:', error);
    });
}


function publishNextEvents() {
    fetch('events/event_publication_schedule.json')
        .then(response => response.json())
        .then(data => {
            // find the next event to publish, if none return default "coming soon!"
            var nextEvents = findNextEvents(data.events);

            // publish the next events to the webpage
            nextEvents.forEach(event => {
                publishEvent({event, section:"next_event"});
            });
        })
        .catch(error => {
            console.error('Error fetching JSON file:', error);
        });
}


function publishPastEvents() {
    fetch('events/event_publication_schedule.json')
    .then(response => response.json())
    .then(data => {
        // sort events in descending order of expiration
        const sortedData = sortByKey({array:data.events, key:'datetime_expire_et', descending:true});

        var current_section = '';

        sortedData.forEach(event => {

            // get the current local time.  TODO: update so it pulls the UTC time and converts it to NYC time for calculations
            const currentTime = new Date();
            const validTime = new Date(event.datetime_valid_et);
            const expireTime = new Date(event.datetime_expire_et);

            // if in future
            if (currentTime > expireTime) {
                if (current_section != expireTime.getFullYear()) {
                    current_section = expireTime.getFullYear();
                    
                    var hElement = document.createElement('h1');
                    hElement.style = 'text-align: center;';
                    hElement.textContent = current_section;
                    document.getElementById('past_events').appendChild(hElement);

                    var divElement = document.createElement('div');
                    divElement.className = "flex-grid";
                    divElement.id = current_section;
                    document.getElementById('past_events').appendChild(divElement);
                }

                // publish the event to the webpage
                publishEvent({event:event, section:current_section});
            }
        })
    })
    .catch(error => {
        console.error('Error fetching JSON file:', error);
    });
    
}


function findNextEvents(events) {
    // sort events in descending order of expiration
    const sortedData = sortByKey({array:events, key:'datetime_expire_et', descending:true});
    
    // get the current local time.  TODO: update so it pulls the UTC time and converts it to NYC time for calculations
    const currentTime = new Date();

    // Assuming the JSON file has an array of event objects
    var nextEvent = [];
    sortedData.forEach(event => {
        // pull event details
        const validTime = new Date(event.datetime_valid_et);
        const expireTime = new Date(event.datetime_expire_et);

        if (currentTime >= validTime & currentTime < expireTime) {
            nextEvent.push(event);
        }
    });

    // If no events are valid, display a default event
    if (nextEvent.length === 0) {
        const event = {
            url_image: "images/NYC_RubberClub_ComingSoon_v4_logo.png",
            url_google_calendar: "",
            alt_image_text: "Check back soon for our next event!"
        };
        nextEvent.push(event);
    }

    return nextEvent;
}


function sortByKey({array=[], key="", descending=false}={}) {
    return array.sort((a, b) => {
        const expireA = new Date(a[key]).getTime();
        const expireB = new Date(b[key]).getTime();

        return (expireB - expireA) * descending ? 1 : -1;
    });
}


function publishEvent({event={}, section=""}={}) {
    // create div
    const divElement = document.createElement('div');

    // create the a href tag element
    const linkElement = document.createElement('a');
    linkElement.href = event.url_google_calendar;
    linkElement.target = "_blank";

    // create the image element
    const imgElement = document.createElement('img');
    imgElement.src = event.url_image;
    imgElement.alt = event.alt_image_text;

    // display the event
    document.getElementById(section).appendChild(divElement);
    divElement.appendChild(linkElement);
    linkElement.appendChild(imgElement);

    // update the content attribute for social media paste (image url in the header)
    // const ogImageMeta = document.querySelector('meta[property="og:image"]');

    // if (ogImageMeta) {
    //     ogImageMeta.content = event.url_image;
    // } else {
    //     // If the <meta> tag doesn't exist, create and append it to the document head
    //     const newMetaTag = document.createElement('meta');
    //     newMetaTag.setAttribute('property', 'og:image');
    //     newMetaTag.content = event.url_image;
    //     document.head.appendChild(newMetaTag);
    // }
}