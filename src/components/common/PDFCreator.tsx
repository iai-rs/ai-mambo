"use client";

import React from "react";

import {
  Page,
  Text,
  View,
  Font,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { type PatientData } from "~/types";
import { getPatientAge } from "~/utils/parseJMBG";
import { modelResultFormatter } from "./Formaters";
import { booleanToTextResolver } from "~/utils/booleanToTextResolver";
import { Button } from "../ui/button";
import { disclaimerText } from "~/constants/copy";

// Register Font
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    // fontFamily: "Roboto",
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 20,
  },
  headerSection: {
    marginTop: 5,
  },
  regularSection: {
    marginTop: 4,
    fontSize: 10,
    color: "#000",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "semibold",
  },
  imageTitle: {
    fontSize: 12,
    fontWeight: "black",
    color: "#000",
  },
  spaceyColumn: {
    flexDirection: "column",
    gap: 4,
  },
  leftTitle: {
    color: "#737373",
  },
  separator: {
    marginTop: 10,
    marginBottom: 10,
    height: 2,
    width: "100%",
    backgroundColor: "#5f5f5f",
  },
  row: {
    flexDirection: "row",
    gap: 4,
  },
  justifiedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
});

type Props = {
  data: PatientData[];
};
const MyDocument = ({ data }: Props) => {
  const patient = data[0];
  if (!patient) return null;

  const {
    acquisitionDate,
    patientName,
    patientId,
    institution,
    manufacturerModel,
    manufacturer,
  } = patient;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{patientName}</Text>
          <View style={styles.row}>
            <Text style={styles.subtitle}>{"JMBG:"}</Text>
            <Text style={styles.subtitle}>{patientId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.subtitle}>{"Starost:"}</Text>
            <Text style={styles.subtitle}>{getPatientAge(patientId)}</Text>
          </View>

          <View style={styles.separator} />
          {/* General data */}
          <View style={styles.regularSection}>
            <View style={styles.spaceyColumn}>
              <View style={styles.row}>
                <Text style={styles.leftTitle}>{"Datum:"}</Text>
                <Text>{acquisitionDate}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.leftTitle}>{"Institucija:"}</Text>
                <Text>{institution}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.leftTitle}>{"Proizvodjac:"}</Text>
                <Text>{manufacturer}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.leftTitle}>{"Model:"}</Text>
                <Text>{manufacturerModel}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.separator} />
        {/* Images */}
        <View
          style={{
            ...styles.regularSection,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {data.map((item) => {
            return (
              <View
                key={item.id}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: 8,
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    fontSize: 12,
                  }}
                >
                  <Text
                    style={styles.imageTitle}
                  >{`${item.laterality} ${item.view}`}</Text>
                  <View style={styles.row}>
                    <Text style={styles.leftTitle}>{"Id:"}</Text>
                    <Text style={{ fontSize: 10 }}>{item.id}</Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.leftTitle}>
                      {"Rezultat AI analize:"}
                    </Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {modelResultFormatter(item.modelResult)}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.leftTitle}>{"Implant"}</Text>
                    <Text>{item.implant}</Text>
                  </View>
                </View>
                {!!item.feedback && (
                  <View
                    style={{
                      fontSize: 11,
                      marginTop: 4,
                      border: "2px solid #8e8c8c",
                      borderRadius: 4,
                      padding: 5,
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {/* <Text style={{ marginBottom: 4 }}>
                      {"Analiza radiologa"}
                    </Text> */}
                    {/* suspektna lezija */}
                    <View style={styles.justifiedRow}>
                      <Text style={styles.leftTitle}>
                        {"Suspektna lezija:"}
                      </Text>
                      <Text>
                        {booleanToTextResolver(item.feedback.suspect_lesion)}
                      </Text>
                    </View>
                    {/* shadow */}
                    <View style={styles.justifiedRow}>
                      <Text style={styles.leftTitle}>{"Senka:"}</Text>
                      <Text>{booleanToTextResolver(item.feedback.shadow)}</Text>
                    </View>
                    {/* Microcalcification */}
                    <View style={styles.justifiedRow}>
                      <Text style={styles.leftTitle}>
                        {"Mikrokalsifikacije:"}
                      </Text>
                      <Text>
                        {booleanToTextResolver(
                          item.feedback.microcalcifications,
                        )}
                      </Text>
                    </View>
                    {/* Symetry */}
                    <View style={styles.justifiedRow}>
                      <Text style={styles.leftTitle}>{"Simetrija:"}</Text>
                      <Text>
                        {booleanToTextResolver(item.feedback.symmetry)}
                      </Text>
                    </View>
                    {/* Arhitectonics */}
                    <View style={styles.justifiedRow}>
                      <Text style={styles.leftTitle}>{"Arhitektonika:"}</Text>
                      <Text>
                        {booleanToTextResolver(item.feedback.architectonics)}
                      </Text>
                    </View>
                    {/* Birads */}
                    <View style={styles.justifiedRow}>
                      <Text style={styles.leftTitle}>
                        {"Birads klasifikacija:"}
                      </Text>
                      <Text>{item.feedback.birads_class}</Text>
                    </View>
                    <View
                      style={{
                        marginTop: 2,
                        marginBottom: 2,
                        height: 1,
                        width: "100%",
                        backgroundColor: "#5f5f5f",
                      }}
                    />
                    {/* Prethodno popunio */}
                    <View style={styles.justifiedRow}>
                      <Text style={styles.leftTitle}>
                        {"Prethodno popunio:"}
                      </Text>
                      <Text>{item.feedback.user_email}</Text>
                    </View>
                    {/* dana */}
                    <View style={styles.justifiedRow}>
                      <Text style={styles.leftTitle}>{"Datum:"}</Text>
                      <Text>{item.feedback.createdAt.toLocaleString()}</Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <View style={{ marginTop: 12 }}>
          <Text
            style={{
              ...styles.leftTitle,
              fontFamily: "Roboto",
              marginTop: 20,
              fontSize: 9,
            }}
          >
            {disclaimerText}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const PDFCreator = ({ data }: Props) => {
  return (
    <PDFDownloadLink fileName="Izveštaj" document={<MyDocument data={data} />}>
      <Button variant="outline">{"Preuzmi .PDF"}</Button>
    </PDFDownloadLink>
  );
};

export default PDFCreator;
