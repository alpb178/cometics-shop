import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Heading } from "../title/heading";

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface FAQProps {
  heading: string;
  faqs: FAQItem[];
}

export function FAQ({ heading, faqs }: FAQProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <Heading heading={heading} />

      {faqs.map((faq) => (
        <View key={faq.id} style={styles.faqItem}>
          <TouchableOpacity
            style={styles.questionContainer}
            onPress={() => toggleExpanded(faq.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.question}>{faq.question}</Text>
            <Text style={styles.expandIcon}>
              {expandedItems.has(faq.id) ? "−" : "+"}
            </Text>
          </TouchableOpacity>

          {expandedItems.has(faq.id) && (
            <View style={styles.answerContainer}>
              <Text style={styles.answer}>{faq.answer}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  faqItem: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    overflow: "hidden",
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    flex: 1,
    marginRight: 12,
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  answerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  answer: {
    marginTop: 10,
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
