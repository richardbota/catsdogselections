const form = document.getElementById('vote-form');

// Form submit event
form.addEventListener('submit', e => {
    const choice = document.querySelector('input[name=pet]:checked').value;
    const data = { pet: choice };

    fetch('http://localhost:3000/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));

    e.preventDefault();
});

fetch('http://localhost:3000/poll')
    .then(res => res.json())
    .then(data => {
        const votes = data.votes;
        const totalVotes = votes.length;
        // Count vote points - acc/current
        const voteCounts = votes.reduce(
            (acc, vote) => (
                (acc[vote.pet] = (acc[vote.pet] || 0) + parseInt(vote.points)), acc
            ),
            {}
        );

        let dataPoints = [
            { label: 'Cat', y: voteCounts.Cat },
            { label: 'Dog', y: voteCounts.Dog },
        ];

        const chartContainer = document.querySelector('#chartContainer');

        if (chartContainer) {
            const chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: 'theme1',
                title: {
                    text: `Total Votes ${totalVotes}`
                },
                data: [
                    {
                        type: 'column',
                        dataPoints: dataPoints
                    }
                ]
            });
            chart.render();

            // Enable pusher logging - don't include this in production
            Pusher.logToConsole = true;

            var pusher = new Pusher('56251c3c7ece26f0c87d', {
                cluster: 'eu',
                forceTLS: true
              });

            var channel = pusher.subscribe('pet-poll');
            channel.bind('pet-vote', function (data) {
                dataPoints = dataPoints.map(x => {
                    if (x.label == data.pet) {
                        x.y += data.points;
                        return x;
                    } else {
                        return x;
                    }
                });
                chart.render();
            });
        }
    });

