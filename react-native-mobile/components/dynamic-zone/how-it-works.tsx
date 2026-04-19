import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Heading } from "../title/heading";
import { SubHeading } from "../title/sub-heading";

export interface Step {
  title: string;
  description: string;
}

export interface HowItWorksProps {
  heading: string;
  sub_heading: string;
  steps: Step[];
}

export function HowItWorks({ heading, sub_heading, steps }: HowItWorksProps) {
  return (
    <View style={styles.container}>
      <Heading heading={heading} />
      <SubHeading sub_heading={sub_heading} />

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <StepCard
            key={index}
            number={index + 1}
            title={step.title}
            description={step.description}
          />
        ))}
      </View>
    </View>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepNumber}>
        <Text style={styles.stepNumberText}>{number}</Text>
      </View>
      <View style={styles.stepContent}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },

  stepsContainer: {
    gap: 10,
  },
  stepCard: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumber: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
