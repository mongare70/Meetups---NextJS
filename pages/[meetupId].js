import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";

import MeetupDetail from "../components/meetups/MeetupDetail";

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
};

//this needs to be exported if it's a dynamic page
export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.REACT_APP_MONGO_DB_URI);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  //fetch only the ids
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    //when fallback is set to true or blocking this means that NextJS would not
    //return a 404 page
    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  //fetch data for a single meetup
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(process.env.REACT_APP_MONGO_DB_URI);
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  //fetch only the ids
  const selectedMeetup = await meetupsCollection.findOne({
    _id: ObjectId(meetupId),
  });

  client.close();

  console.log(meetupId);
  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.data.title,
        image: selectedMeetup.data.image,
        address: selectedMeetup.data.address,
        description: selectedMeetup.data.description,
      },
    },
  };
}

export default MeetupDetails;
