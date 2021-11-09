import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active react meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  );
};

// //Server-side rendering
// export async function getServerSideProps() {
//   //fetch data from API

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//     //No need to revalidate after a number of seconds
//   };
// }

//Static Generation (Pre-rendering)
export async function getStaticProps() {
  // fetch data from an API
  const client = await MongoClient.connect(process.env.REACT_APP_MONGO_DB_URI);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.data.title,
        address: meetup.data.address,
        image: meetup.data.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
