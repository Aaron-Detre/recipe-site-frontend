"use client";
import {
  Button,
  Card,
  Col,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Ingredient, ScalableIngredient } from "../UtilClasses/Types";
import { FaTrashAlt } from "react-icons/fa";
import FlexGap from "../UtilClasses/FlexGap";
import type { ChangeEvent } from "react";

export default function IngredientsEditor({
  scalable,
  setScalable,
  ingredients,
  setIngredients,
  scalableIngredients,
  setScalableIngredients,
}: {
  scalable: boolean;
  setScalable: Function;
  ingredients: Ingredient[];
  setIngredients: Function;
  scalableIngredients: ScalableIngredient[];
  setScalableIngredients: Function;
}) {
  const ingredientChanges = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ingredientIndex: number
  ) => {
    const mapIngredients = <T,>(ingredient: T, index: number) => {
      if (ingredientIndex === index) {
        return { ...ingredient, ingredient: e.target.value };
      } else {
        return ingredient;
      }
    };
    if (scalable) {
      setScalableIngredients(
        scalableIngredients.map(mapIngredients<ScalableIngredient>)
      );
    } else {
      setIngredients(ingredients.map(mapIngredients<Ingredient>));
    }
  };
  const measurementChanges = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    measurementIndex: number
  ) =>
    setIngredients(
      ingredients.map((ingredient: Ingredient, index) => {
        if (measurementIndex === index) {
          return { ...ingredient, measure: e.target.value };
        } else {
          return ingredient;
        }
      })
    );
  const amountChanges = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    amountIndex: number
  ) =>
    setScalableIngredients(
      scalableIngredients.map((ingredient: ScalableIngredient, index) => {
        if (amountIndex === index) {
          return { ...ingredient, amount: e.target.value };
        } else {
          return ingredient;
        }
      })
    );
  const unitChanges = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    unitIndex: number
  ) =>
    setScalableIngredients(
      scalableIngredients.map((ingredient: ScalableIngredient, index) => {
        if (unitIndex === index) {
          return { ...ingredient, unit: e.target.value };
        } else {
          return ingredient;
        }
      })
    );
  const defaultIngredient: Ingredient = { ingredient: "", measure: "" };
  const defaultScalableIngredient: ScalableIngredient = {
    ingredient: "",
    amount: 0,
    unit: "",
  };
  const addNewIngredient = () => {
    if (scalable) {
      setScalableIngredients([
        ...scalableIngredients,
        { ...defaultScalableIngredient, id: uuidv4() },
      ]);
    } else {
      setIngredients([...ingredients, { ...defaultIngredient, id: uuidv4() }]);
    }
  };
  const deleteIngredient = (ingredientIndex: number) => {
    const removeIngredientAtIndex = <T,>(prevIngredients: T[]) =>
      prevIngredients.filter((ingredient, index) => ingredientIndex !== index);
    if (scalable) {
      setScalableIngredients(removeIngredientAtIndex<ScalableIngredient>);
    } else {
      setIngredients(removeIngredientAtIndex<Ingredient>);
    }
  };
  const convertScalableIngredientsToStandard = () => {
    const convertToNonScalable = (
      scalableIngredient: ScalableIngredient
    ): Ingredient => {
      const amount = scalableIngredient.amount;
      return {
        id: scalableIngredient.id,
        ingredient: scalableIngredient.ingredient,
        measure: `${amount === 0 ? "" : amount + " "}${
          scalableIngredient.unit
        }`,
      };
    };
    setIngredients(scalableIngredients.map(convertToNonScalable));
  };
  const convertIngredientsToScalable = () => {
    const convertToScalable = (ingredient: Ingredient): ScalableIngredient => {
      let scalableIngredient: ScalableIngredient;
      const measureTokens = ingredient.measure.trim().split(" ");
      let amount: number;
      if (measureTokens.length > 0) {
        const numPattern = /^\d+$/;
        const fractionPattern = /^\d+\/\d+$/;
        const decimalPattern = /^\d+\.\d+$/;
        const firstToken = measureTokens.at(0) ?? "0";
        if (decimalPattern.test(firstToken)) {
          amount = Number.parseFloat(firstToken);
        } else if (numPattern.test(firstToken)) {
          amount = Number.parseInt(firstToken);
        } else if (fractionPattern.test(firstToken)) {
          const [num, den] = firstToken.split("/").map(Number);
          amount = num === 0 ? 0 : Number.parseFloat((num / den).toFixed(2));
        } else {
          amount = 0;
        }
        const unit = amount === 0 ? "" : measureTokens.slice(1).join(" ");
        scalableIngredient = {
          id: ingredient.id,
          ingredient: ingredient.ingredient,
          amount: amount,
          unit: unit,
        };
      } else {
        scalableIngredient = {
          ...defaultScalableIngredient,
          id: ingredient.id,
        };
      }
      return scalableIngredient;
    };
    setScalableIngredients(ingredients.map(convertToScalable));
  };
  const toggleScalable = (e: ChangeEvent<HTMLInputElement>) => {
    if (scalable) {
      convertScalableIngredientsToStandard();
    } else {
      convertIngredientsToScalable();
    }
    setScalable(e.target.checked);
  };

  return (
    <Card>
      <Card.Header className="d-flex align-items-baseline mt-1">
        <Card.Title>
          <FormLabel>Ingredients</FormLabel>
        </Card.Title>
        <FlexGap />
        <FormCheck
          type="checkbox"
          label="Scalable"
          checked={scalable}
          onChange={toggleScalable}
        />
        <Button onClick={addNewIngredient} className="ms-2">
          +Ingredient
        </Button>
      </Card.Header>
      <Card.Body>
        {scalable &&
          scalableIngredients.map((ingredient, index) => (
            <Card
              key={ingredient.id}
              className={index === scalableIngredients.length - 1 ? "" : "mb-3"}
            >
              <Card.Header className="d-flex align-items-center pb-1">
                <Card.Title>Ingredient {index + 1}</Card.Title>
                <FlexGap />
                <FaTrashAlt
                  className="wdf-cursor-pointer"
                  onClick={() => deleteIngredient(index)}
                />
              </Card.Header>
              <Card.Body className="pt-2">
                <FormGroup controlId={`wdf-editor-ingredient-${index}`}>
                  <FormLabel>Name</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Ingredient Name"
                    onChange={(e) => ingredientChanges(e, index)}
                    required
                    value={ingredient.ingredient}
                  />
                </FormGroup>
                <Row className="mt-2">
                  <Col xs={4}>
                    <FormGroup controlId={`wdf-editor-amount-${index}`}>
                      <FormLabel>Amount</FormLabel>
                      <FormControl
                        type="number"
                        placeholder="Amount"
                        onChange={(e) => amountChanges(e, index)}
                        required
                        value={ingredient.amount}
                      />
                    </FormGroup>
                  </Col>
                  <Col xs={8}>
                    <FormGroup controlId={`wdf-editor-ingredient-${index}`}>
                      <FormLabel>Unit</FormLabel>
                      <FormControl
                        type="text"
                        placeholder="Unit of Measurement"
                        onChange={(e) => unitChanges(e, index)}
                        required
                        value={ingredient.unit}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        {!scalable &&
          ingredients.map((ingredient, index) => (
            <Card
              key={ingredient.id}
              className={index === ingredients.length - 1 ? "" : "mb-3"}
            >
              <Card.Header className="d-flex align-items-center pb-1">
                <Card.Title>Ingredient {index + 1}</Card.Title>
                <FlexGap />
                <FaTrashAlt
                  className="wdf-cursor-pointer"
                  onClick={() => deleteIngredient(index)}
                />
              </Card.Header>
              <Card.Body className="pt-2">
                <Row>
                  <Col xl={6}>
                    <FormGroup controlId={`wdf-editor-ingredient-${index}`}>
                      <FormLabel>Name</FormLabel>
                      <FormControl
                        type="text"
                        placeholder="Ingredient Name"
                        onChange={(e) => ingredientChanges(e, index)}
                        required
                        value={ingredient.ingredient}
                      />
                    </FormGroup>
                  </Col>
                  <Col xl={6}>
                    <FormGroup
                      controlId={`wdf-editor-measure-${index}`}
                    >
                      <FormLabel>Measurement</FormLabel>
                      <FormControl
                        type="text"
                        placeholder="Ingredient Measurement"
                        onChange={(e) => measurementChanges(e, index)}
                        required
                        value={ingredient.measure}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
      </Card.Body>
    </Card>
  );
}
