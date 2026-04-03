const DEFAULT_DURATION_MINUTES = 45;

const SEQUENCE_OVERRIDES = {
  "M7NS-Ia": {
    packTitle: "Sets and the Real Number System",
    pacingLabel: "Set concepts before number-system classification",
    microLessons: [
      createSlice("Well-Defined Sets and Basic Set Concepts", "Illustrate well-defined sets, subsets, universal sets, and the null set."),
      createSlice("Cardinality, Union, Intersection, and Difference of Sets", "Find cardinality and perform basic operations on sets."),
      createSlice("Subsets of the Real Number System", "Classify numbers as natural, whole, integer, rational, irrational, or real numbers."),
    ],
  },
  "M7NS-Ic": {
    packTitle: "Absolute Value and Integers",
    pacingLabel: "Meaning first, then operations and properties",
    microLessons: [
      createSlice("Absolute Value and Comparing Integers", "Illustrate absolute value and compare integers on a number line."),
      createSlice("Operations on Integers", "Perform addition, subtraction, multiplication, and division of integers correctly."),
      createSlice("Properties of Operations on Integers", "Use the properties of operations to simplify and justify computations with integers."),
    ],
  },
  "M7NS-Ie": {
    packTitle: "Rational Numbers",
    pacingLabel: "Representation before operations",
    microLessons: [
      createSlice("Fraction and Decimal Forms of Rational Numbers", "Express rational numbers from fraction form to decimal form and vice versa."),
      createSlice("Rational Numbers on the Number Line", "Represent and arrange rational numbers on the number line."),
      createSlice("Operations on Rational Numbers", "Perform operations on rational numbers and solve related problems."),
    ],
  },
  "M7NS-Ig": {
    packTitle: "Square Roots and Irrational Numbers",
    pacingLabel: "Principal roots before irrational-number placement",
    microLessons: [
      createSlice("Principal Roots and Perfect Squares", "Determine principal square roots of perfect squares and describe their meaning."),
      createSlice("Irrational Numbers and Estimating Square Roots", "Identify irrational numbers and estimate square roots of non-perfect squares."),
      createSlice("Plotting Irrational Numbers on the Number Line", "Locate and compare irrational numbers on the number line."),
    ],
  },
  "M7NS-Ii": {
    packTitle: "Real Numbers in Real Life",
    pacingLabel: "Scientific notation before contextual problem solving",
    microLessons: [
      createSlice("Scientific Notation", "Express very large and very small numbers using scientific notation."),
      createSlice("Real Numbers in Context", "Use rational and irrational numbers appropriately in real-life situations and explain their meaning."),
    ],
  },
  "M7ME-IIa": {
    packTitle: "Measurement",
    pacingLabel: "Approximate first, then judge and round",
    microLessons: [
      createSlice("Approximating Measurements", "Estimate measurements of length, mass, volume, time, angle, temperature, and rate using appropriate units."),
      createSlice("Precision and Accuracy", "Distinguish precision from accuracy and describe how each affects a measurement result."),
      createSlice("Significant Figures and Rounding", "Use significant figures and rounding rules to report measured quantities appropriately."),
    ],
  },
  "M7ME-IIb": {
    packTitle: "Conversion of Units",
    pacingLabel: "Metric first, then English and applications",
    microLessons: [
      createSlice("Metric Unit Conversions", "Convert measurements within the metric system using place-value relationships and conversion factors."),
      createSlice("English Unit Conversions", "Convert measurements within the English or customary system using appropriate conversion factors."),
      createSlice("Solving Problems Involving Unit Conversion", "Solve contextual problems that require one-step or multi-step unit conversion."),
    ],
  },
  "M7AL-IIc": {
    packTitle: "Algebraic Expressions and Polynomials",
    pacingLabel: "Translate first, then evaluate and classify",
    microLessons: [
      createSlice("Translating Verbal Phrases into Algebraic Expressions", "Translate English phrases and simple statements into algebraic expressions and vice versa."),
      createSlice("Evaluating Algebraic Expressions", "Evaluate algebraic expressions correctly for given values of the variables."),
      createSlice("Classifying Polynomials", "Classify polynomials according to degree and number of terms."),
    ],
  },
  "M7AL-IId": {
    packTitle: "Exponents and Polynomial Operations",
    pacingLabel: "Exponent rules before polynomial operations",
    microLessons: [
      createSlice("Laws of Exponents", "Derive and apply the laws of exponents for positive integer exponents."),
      createSlice("Addition and Subtraction of Polynomials", "Add and subtract polynomials by combining like terms accurately."),
      createSlice("Multiplication Involving Polynomials", "Multiply monomials and polynomials using exponent rules and the distributive property."),
    ],
  },
  "M7AL-IIe": {
    packTitle: "Special Products",
    pacingLabel: "Product type by product type",
    microLessons: [
      createSlice("Product of Two Binomials", "Use models and algebraic methods to find the product of two binomials."),
      createSlice("Product of the Sum and Difference of Two Terms", "Use models and algebraic methods to expand the product of the sum and difference of two terms."),
      createSlice("Square and Cube of a Binomial", "Use models and algebraic methods to expand the square and cube of a binomial."),
      createSlice("Product of a Binomial and a Trinomial", "Use algebraic methods to expand the product of a binomial and a trinomial."),
    ],
  },
  "M7AL-IIh": {
    packTitle: "Linear Equations and Inequalities in One Variable",
    pacingLabel: "Differentiate first, then illustrate equations and inequalities",
    microLessons: [
      createSlice("Expressions, Equations, and Inequalities", "Differentiate algebraic expressions, equations, and inequalities."),
      createSlice("Illustrating Linear Equations in One Variable", "Represent and identify linear equations in one variable."),
      createSlice("Illustrating Linear Inequalities in One Variable", "Represent and identify linear inequalities in one variable."),
    ],
  },
  "M7AL-IIj": {
    packTitle: "Solving Equations and Inequalities in One Variable",
    pacingLabel: "Solve first, then handle absolute value and word problems",
    microLessons: [
      createSlice("Solving Linear Equations in One Variable", "Solve linear equations in one variable using algebraic methods and justify each step."),
      createSlice("Solving Linear Inequalities in One Variable", "Solve linear inequalities in one variable and express the solution set correctly."),
      createSlice("Solving Equations and Inequalities Involving Absolute Value", "Solve simple equations and inequalities in one variable involving absolute value using graphing or algebraic methods."),
      createSlice("Word Problems on Equations and Inequalities", "Model and solve word problems involving equations and inequalities in one variable."),
    ],
  },
  "M7GE-IIIa": {
    packTitle: "Basic Concepts in Geometry",
    pacingLabel: "Core geometric ideas in one connected lesson",
    microLessons: [
      createSlice("Points, Lines, Planes, and Subsets of a Line", "Represent points, lines, and planes using concrete, pictorial, and symbolic models and illustrate line segments, rays, opposite rays, and related subsets of a line."),
    ],
  },
  "M7GE-IIIb": {
    packTitle: "Angles",
    pacingLabel: "From identifying to solving",
    microLessons: [
      createSlice("Classifying and Measuring Angles", "Identify, name, and measure angles in diagrams and real contexts."),
      createSlice("Using Angle Relationships", "Use complementary, supplementary, adjacent, and vertical relationships to solve for missing angles."),
    ],
  },
  "M7GE-IIIc": {
    packTitle: "Parallel Lines and Transversals",
    pacingLabel: "Angle pairs before relationship-based solving",
    microLessons: [
      createSlice("Angles Formed by a Transversal", "Identify the angle pairs formed when a transversal cuts two lines."),
      createSlice("Relationships Among Angles in Parallel Lines", "Use corresponding, alternate interior, alternate exterior, and same-side interior angle relationships for parallel lines."),
      createSlice("Solving Problems with Transversal Angle Relationships", "Solve for unknown angle measures using properties of parallel lines cut by a transversal."),
    ],
  },
  "M7GE-IIIe": {
    packTitle: "Polygons",
    pacingLabel: "Polygon structure before angle relationships",
    microLessons: [
      createSlice("Kinds of Polygons and Convexity", "Illustrate polygons, classify them by number of sides, and distinguish convex from non-convex polygons."),
      createSlice("Angles and Sides of Polygons", "Identify parts of regular polygons and describe side and angle properties of triangles and other polygons."),
      createSlice("Interior and Exterior Angle Relationships of Polygons", "Determine and use the sums of interior and exterior angles of convex polygons in problem solving."),
    ],
  },
  "M7SP-IVd": {
    packTitle: "Graphs",
    pacingLabel: "Graph family by graph family",
    microLessons: [
      createSlice("Bar and Line Graphs", "Read, construct, and interpret bar and line graphs for discrete and changing data."),
      createSlice("Pie Charts", "Represent parts of a whole and compare categories using pie charts."),
      createSlice("Histograms and Ogives", "Use grouped-data graphs and cumulative displays to interpret distributions."),
    ],
  },
  "M7SP-IVf": {
    packTitle: "Measures of Central Tendency",
    pacingLabel: "Compute first, then choose and interpret",
    microLessons: [
      createSlice("Mean, Median, and Mode", "Compute the common measures of central tendency accurately."),
      createSlice("Choosing the Best Measure", "Interpret data and decide which measure best represents the set."),
    ],
  },
  "M8AL-Ia": {
    packTitle: "Factoring Polynomials",
    pacingLabel: "Basic factor patterns before problem solving",
    microLessons: [
      createSlice("Common Monomial Factor and Basic Factoring", "Factor polynomials using a common monomial factor and recognize factoring as the reverse of multiplication."),
      createSlice("Special Polynomial Factoring Patterns", "Factor special polynomial forms such as difference of two squares, perfect square trinomials, and sum or difference of cubes."),
      createSlice("General Trinomials and Problems Involving Factors", "Factor general trinomials and use polynomial factors to solve routine and contextual problems."),
    ],
  },
  "M8AL-Ic": {
    packTitle: "Rational Algebraic Expressions",
    pacingLabel: "Illustrate, simplify, operate, then solve",
    microLessons: [
      createSlice("Illustrating Rational Algebraic Expressions", "Describe and identify rational algebraic expressions and the restrictions on their denominators."),
      createSlice("Simplifying Rational Algebraic Expressions", "Simplify rational algebraic expressions by factoring numerators and denominators and reducing common factors."),
      createSlice("Multiplying and Dividing Rational Algebraic Expressions", "Perform multiplication and division of rational algebraic expressions correctly."),
      createSlice("Adding and Subtracting Rational Algebraic Expressions", "Perform addition and subtraction of rational algebraic expressions with similar and dissimilar denominators."),
      createSlice("Problems Involving Rational Algebraic Expressions", "Solve routine and contextual problems involving rational algebraic expressions."),
    ],
  },
  "M8AL-Ie-1": {
    packTitle: "Rectangular Coordinate System",
    pacingLabel: "Coordinate-plane orientation and plotting",
    microLessons: [
      createSlice("Axes, Origin, Quadrants, and Ordered Pairs", "Illustrate the coordinate plane, its axes, the origin, and the four quadrants and plot points and identify ordered pairs correctly on the rectangular coordinate system."),
    ],
  },
  "M8AL-Ie-4": {
    packTitle: "Slope of a Line",
    pacingLabel: "Slope as meaning and measure",
    microLessons: [
      createSlice("Meaning of Slope and Finding Slope", "Illustrate slope as rate of change and as the steepness or direction of a line and determine the slope of a line from its graph, two given points, or its equation."),
    ],
  },
  "M8AL-Ii": {
    packTitle: "Systems of Linear Equations",
    pacingLabel: "Method by method",
    microLessons: [
      createSlice("Graphing Method", "Solve a system by locating the point of intersection."),
      createSlice("Substitution Method", "Solve a system by isolating and substituting one variable."),
      createSlice("Elimination Method", "Solve a system by removing one variable strategically."),
      createSlice("Cramer's Rule", "Use determinants to solve a two-variable system."),
    ],
  },
  "M8AL-Ih": {
    packTitle: "Systems of Linear Equations",
    pacingLabel: "Illustrate first, then classify",
    microLessons: [
      createSlice("Representing Systems of Linear Equations", "Illustrate a system of linear equations using tables, equations, and graphs."),
      createSlice("Classifying Systems by Their Graphs", "Determine whether a system is intersecting, parallel, or coinciding and relate this to the number of solutions."),
    ],
  },
  "M8AL-If": {
    packTitle: "Linear Equations in Two Variables",
    pacingLabel: "Graph first, then describe",
    microLessons: [
      createSlice("Graphing Linear Equations", "Graph linear equations in two variables using points, intercepts, or other given information."),
      createSlice("Describing Linear Graphs", "Describe the graph of a linear equation in terms of slope and intercepts."),
    ],
  },
  "M8AL-Ig-1": {
    packTitle: "Equation of a Line",
    pacingLabel: "Build the equation from given information",
    microLessons: [
      createSlice("Equation from Slope and a Point", "Determine the equation of a line using a point and the slope."),
      createSlice("Equation from Graph or Two Points", "Determine the equation of a line from its graph, intercepts, or two given points."),
    ],
  },
  "M8AL-IIc-2": {
    packTitle: "Relations and Functions",
    pacingLabel: "From relation to function behavior",
    microLessons: [
      createSlice("Relations and Functions", "Distinguish a function from a general relation using ordered pairs, mappings, and tables."),
      createSlice("Domain and Range", "Determine domain and range and identify dependent and independent variables."),
    ],
  },
  "M8AL-IIa": {
    packTitle: "Linear Inequalities in Two Variables",
    pacingLabel: "Differentiate first, then graph",
    microLessons: [
      createSlice("Linear Inequalities versus Linear Equations", "Differentiate linear inequalities in two variables from linear equations in two variables."),
      createSlice("Graphing Linear Inequalities", "Graph linear inequalities in two variables and identify their solution regions."),
    ],
  },
  "M8AL-IIb": {
    packTitle: "Systems of Linear Inequalities",
    pacingLabel: "Graph the system, then solve problems",
    microLessons: [
      createSlice("Graphing Systems of Linear Inequalities", "Graph systems of linear inequalities and determine the feasible region."),
      createSlice("Solving Problems Using Feasible Regions", "Use systems of linear inequalities to solve contextual problems."),
    ],
  },
  "M8AL-IIc-1": {
    packTitle: "Linear Programming",
    pacingLabel: "Model first, then optimize",
    microLessons: [
      createSlice("Modeling Constraints and Objective Function", "Represent a simple optimization problem using constraints and an objective function."),
      createSlice("Finding the Optimal Solution", "Determine the optimal value from the feasible region of a simple linear programming problem."),
    ],
  },
  "M8AL-IId": {
    packTitle: "Linear Functions",
    pacingLabel: "Represent, analyze, then apply",
    microLessons: [
      createSlice("Representing Linear Functions", "Represent a linear function using ordered pairs, tables, equations, and graphs."),
      createSlice("Slope, Intercepts, Domain, and Range", "Describe a linear function using slope, intercepts, domain, and range."),
      createSlice("Applications of Linear Functions", "Use linear functions to model and solve real-life situations."),
    ],
  },
  "M7GE-IIIg": {
    packTitle: "Circles",
    pacingLabel: "Basic parts before angle terms",
    microLessons: [
      createSlice("Parts of a Circle", "Illustrate and name the center, radius, diameter, chord, and arc of a circle."),
      createSlice("Central and Inscribed Angles", "Illustrate and distinguish central angles and inscribed angles in a circle."),
    ],
  },
  "M7GE-IIIh": {
    packTitle: "Geometric Constructions",
    pacingLabel: "Tool use before figure construction",
    microLessons: [
      createSlice("Euclidean Tools, Copying, and Bisecting", "Use a compass and straightedge to copy segments and angles and to bisect line segments and angles."),
      createSlice("Constructing Perpendicular and Parallel Lines", "Construct perpendicular and parallel lines using Euclidean tools."),
      createSlice("Constructing Polygons", "Construct triangles, squares, rectangles, regular pentagons, and regular hexagons using a straightedge and compass."),
    ],
  },
  "M8GE-IIf": {
    packTitle: "Conditional Statements",
    pacingLabel: "Conditional statements as complete claims",
    microLessons: [
      createSlice("If-Then Statements with Hypothesis and Conclusion", "Rewrite mathematical and everyday statements in if-then form correctly and identify the hypothesis and conclusion of a conditional statement to interpret the claim."),
    ],
  },
  "M8GE-IIg": {
    packTitle: "Related Conditional Statements",
    pacingLabel: "From variants to logical meaning",
    microLessons: [
      createSlice("Inverse and Converse", "Form the inverse and converse of a conditional statement and compare them with the original statement."),
      createSlice("Contrapositive and Logical Equivalence", "Write the contrapositive and determine when statements are logically equivalent."),
    ],
  },
  "M8GE-IIh": {
    packTitle: "Mathematical Reasoning and Proof",
    pacingLabel: "Conjecture first, then justify",
    microLessons: [
      createSlice("Inductive Reasoning and Conjectures", "Use patterns and examples to form reasonable conjectures."),
      createSlice("Deductive Reasoning and Valid Arguments", "Use definitions, properties, and syllogisms to make valid conclusions."),
      createSlice("Writing Simple Proofs", "Organize statements and reasons to justify mathematical claims in proof form."),
    ],
  },
  "M8GE-IIIa": {
    packTitle: "Axiomatic Structure of Geometry",
    pacingLabel: "Geometric foundations within one logical structure",
    microLessons: [
      createSlice("Undefined Terms, Definitions, Postulates, and Theorems", "Distinguish undefined terms, definitions, and postulates in a geometric system and explain how theorems are built from accepted postulates and earlier results."),
    ],
  },
  "M8GE-IIId": {
    packTitle: "Triangle Congruence",
    pacingLabel: "Illustrate first, then justify",
    microLessons: [
      createSlice("Illustrating Triangle Congruence", "Match corresponding sides and angles and interpret what it means for two triangles to be congruent."),
      createSlice("SAS, ASA, and SSS Congruence Postulates", "Use SAS, ASA, and SSS to justify that two triangles are congruent."),
      createSlice("Solving for Corresponding Parts", "Use congruent triangles to solve for unknown measures of corresponding sides and angles."),
    ],
  },
  "M8GE-IIIg": {
    packTitle: "Proving Triangle Congruence",
    pacingLabel: "Prove first, then extend the proof",
    microLessons: [
      createSlice("Proving Two Triangles are Congruent", "Construct logical arguments that prove two triangles congruent using valid congruence postulates."),
      createSlice("Proving Statements Using Triangle Congruence", "Use triangle congruence as a basis for proving statements about sides, angles, and constructed figures."),
    ],
  },
  "M8GE-IVa": {
    packTitle: "Triangle Inequalities",
    pacingLabel: "Basic inequality to theorem-based application",
    microLessons: [
      createSlice("Triangle Inequality Theorem", "Decide whether given lengths can form a triangle and justify the decision using the triangle inequality theorem."),
      createSlice("Exterior Angle Inequality Theorem", "Relate an exterior angle of a triangle to its remote interior angles and use the relationship to compare measures."),
      createSlice("Hinge Theorem and Triangle Comparison", "Use the hinge theorem and related inequality ideas to compare sides and angles of triangles."),
    ],
  },
  "M8GE-IVd": {
    packTitle: "Parallel and Perpendicular Lines",
    pacingLabel: "Angle relationships before proving line conditions",
    microLessons: [
      createSlice("Parallel Lines and Transversal Angle Relationships", "Use corresponding, alternate interior, alternate exterior, and same-side interior angles to analyze lines cut by a transversal."),
      createSlice("Conditions for Parallel Lines", "Determine and justify when lines or segments are parallel using angle relationships."),
      createSlice("Conditions for Perpendicular Lines", "Determine and justify when lines or segments are perpendicular and apply the conditions in geometric figures."),
    ],
  },
  "M8SP-IVf": {
    packTitle: "Introduction to Probability",
    pacingLabel: "Experiment first, then sample space and counting",
    microLessons: [
      createSlice("Experiments, Outcomes, Sample Space, and Events", "Illustrate experiments, outcomes, sample spaces, and events in simple situations."),
      createSlice("Counting Methods for Outcomes", "Count the number of occurrences of outcomes using tables, tree diagrams, systematic listing, and the fundamental counting principle."),
    ],
  },
  "M8SP-IVh": {
    packTitle: "Probability of Simple Events",
    pacingLabel: "Favorable outcomes before problem solving",
    microLessons: [
      createSlice("Finding the Probability of a Simple Event", "Find the probability of a simple event using favorable outcomes over total outcomes."),
      createSlice("Solving Problems Involving Probability of Simple Events", "Solve routine and contextual problems involving the probability of simple events."),
    ],
  },
  "M8SP-IVi": {
    packTitle: "Experimental and Theoretical Probability",
    pacingLabel: "Illustrate first, then compare and interpret",
    microLessons: [
      createSlice("Experimental Probability", "Illustrate experimental probability using repeated trials and recorded outcomes."),
      createSlice("Theoretical Probability", "Determine theoretical probability from a sample space or counting method."),
      createSlice("Comparing Experimental and Theoretical Probability", "Compare experimental and theoretical probability and explain why they may differ."),
    ],
  },
  "M8SP-IVj": {
    packTitle: "Linear Correlation and Regression",
    pacingLabel: "Scatter plots before line-based prediction",
    microLessons: [
      createSlice("Scatter Plots and Types of Correlation", "Construct and interpret scatter plots and describe positive, negative, or no linear correlation."),
      createSlice("Strength of Correlation and Trend", "Describe the strength and direction of a linear relationship from bivariate data and a scatter plot."),
      createSlice("Regression Line and Prediction", "Use a line of best fit or regression line to make and interpret predictions from data."),
    ],
  },
  "M9AL-Ia": {
    packTitle: "Quadratic Equations",
    pacingLabel: "Equation form to method-based solving",
    microLessons: [
      createSlice("Recognizing Quadratic Equations", "Recognize quadratic equations and write them in standard form."),
      createSlice("Solving by Extracting Roots", "Solve quadratic equations by extracting square roots."),
      createSlice("Solving by Factoring", "Solve quadratic equations by factoring."),
    ],
  },
  "M9AL-Ib": {
    packTitle: "Quadratic Equations",
    pacingLabel: "Build the perfect square, then solve",
    microLessons: [
      createSlice("Completing the Square to Form a Perfect Square Trinomial", "Transform a quadratic equation into an equivalent perfect square trinomial by completing the square."),
      createSlice("Solving Quadratic Equations by Completing the Square", "Solve quadratic equations by completing the square and justify each algebraic step."),
    ],
  },
  "M9AL-Ic": {
    packTitle: "Quadratic Equations",
    pacingLabel: "Formula-based solving with root analysis",
    microLessons: [
      createSlice("Quadratic Formula and Nature of the Roots", "Solve quadratic equations by using the quadratic formula and use the discriminant to characterize the nature of the roots of a quadratic equation."),
    ],
  },
  "M9AL-Id": {
    packTitle: "Roots of Quadratic Equations",
    pacingLabel: "Root relationships and equation building",
    microLessons: [
      createSlice("Sum and Product of Roots and Quadratic Equations", "Use the coefficients of a quadratic equation to determine the sum and product of its roots and construct a quadratic equation when the roots, or their sum and product, are given."),
    ],
  },
  "M9AL-Ie": {
    packTitle: "Quadratic-Type Equations",
    pacingLabel: "Transform first, then solve",
    microLessons: [
      createSlice("Transforming Equations into Quadratic Form", "Rewrite suitable equations into quadratic form through substitution or algebraic transformation."),
      createSlice("Solving Equations Transformable to Quadratic", "Solve transformed equations and interpret the resulting solutions correctly."),
    ],
  },
  "M9AL-If": {
    packTitle: "Quadratic Equations in Context",
    pacingLabel: "Model first, then solve and interpret",
    microLessons: [
      createSlice("Modeling Real-Life Situations with Quadratic Equations", "Represent real-life situations using quadratic equations."),
      createSlice("Solving and Interpreting Quadratic Problems", "Solve quadratic equations arising from real-life situations and interpret the solutions in context."),
    ],
  },
  "M9AL-IIa": {
    packTitle: "Quadratic Inequalities",
    pacingLabel: "Represent the solution, then interpret it",
    microLessons: [
      createSlice("Solving Quadratic Inequalities", "Solve quadratic inequalities using factorization, sign analysis, or graph-based reasoning."),
      createSlice("Interpreting Solution Sets", "Express and interpret solution sets on the number line, in interval notation, or in context."),
    ],
  },
  "M9AL-IIe": {
    packTitle: "Variations",
    pacingLabel: "Variation type by variation type",
    microLessons: [
      createSlice("Direct Variation", "Model direct relationships and solve direct variation problems."),
      createSlice("Inverse Variation", "Represent inverse relationships and interpret their behavior."),
      createSlice("Joint Variation", "Translate and solve statements involving joint variation."),
      createSlice("Combined Variation", "Handle problems that blend direct and inverse variation."),
    ],
  },
  "M9AL-IIb": {
    packTitle: "Quadratic Functions",
    pacingLabel: "Representation to transformation",
    microLessons: [
      createSlice("Representing Quadratic Functions", "Represent a quadratic function using tables, graphs, and equations and distinguish it from non-quadratic functions."),
      createSlice("Vertex Form and Transformations", "Transform a quadratic function into vertex form and describe how the values of a, h, and k change the graph."),
      createSlice("Modeling and Problem Solving", "Use quadratic functions to model and solve real-life situations."),
    ],
  },
  "M9AL-IIc": {
    packTitle: "Quadratic Graph Features",
    pacingLabel: "Key features, then interpretation",
    microLessons: [
      createSlice("Vertex, Axis, and Opening", "Identify the vertex, axis of symmetry, and opening from an equation or graph."),
      createSlice("Intercepts and Meaning", "Determine intercepts and interpret what the graph shows in context."),
    ],
  },
  "M9AL-IId": {
    packTitle: "Rational Algebraic Equations",
    pacingLabel: "Restriction to solving",
    microLessons: [
      createSlice("Domain Restrictions and Extraneous Solutions", "Identify restrictions on rational expressions and recognize why extraneous solutions can appear."),
      createSlice("Solving Rational Algebraic Equations", "Solve rational algebraic equations and verify whether obtained solutions are valid."),
    ],
  },
  "M9AL-IIf": {
    packTitle: "Radicals",
    pacingLabel: "Laws first, then operations",
    microLessons: [
      createSlice("Simplifying Radical Expressions", "Use the laws of radicals to simplify radical expressions."),
      createSlice("Operations on Radical Expressions", "Perform addition, subtraction, multiplication, and division of radical expressions when defined."),
    ],
  },
  "M9GE-IIIa": {
    packTitle: "Parallelograms",
    pacingLabel: "Conditions first, then properties and proof",
    microLessons: [
      createSlice("Conditions that Make a Quadrilateral a Parallelogram", "Determine whether a quadrilateral is a parallelogram using sufficient conditions."),
      createSlice("Properties of Parallelograms", "Use the properties of parallelograms to find unknown angles, sides, and diagonals."),
      createSlice("Proving Properties of Parallelograms", "Justify important properties of parallelograms using definitions, postulates, and theorems."),
    ],
  },
  "M9GE-IIIb": {
    packTitle: "Special Parallelograms",
    pacingLabel: "Rectangle, rhombus, then square",
    microLessons: [
      createSlice("Rectangle Theorems", "Prove and apply properties that characterize rectangles."),
      createSlice("Rhombus Theorems", "Prove and apply properties that characterize rhombi."),
      createSlice("Square as Rectangle and Rhombus", "Relate the properties of a square to those of rectangles and rhombi and use them in problem solving."),
    ],
  },
  "M9GE-IIIc": {
    packTitle: "Trapezoids and Kites",
    pacingLabel: "Midline to theorem-based applications",
    microLessons: [
      createSlice("Midline and Trapezoid Properties", "Use the midline theorem and other trapezoid properties to justify and solve geometric relationships."),
      createSlice("Kite Theorems", "Prove and apply the defining properties of kites."),
      createSlice("Problems Involving Trapezoids and Kites", "Solve geometric problems involving side lengths, diagonals, angles, and midsegments of trapezoids and kites."),
    ],
  },
  "M9GE-IIId": {
    packTitle: "Triangle Similarity",
    pacingLabel: "Criteria before theorem-based proof",
    microLessons: [
      createSlice("AA Similarity Postulate", "Use angle relationships to justify triangle similarity through the AA similarity postulate."),
      createSlice("SAS and SSS Similarity Theorems", "Use side ratios together with included-angle or side-to-side conditions to prove triangle similarity."),
      createSlice("Proving Triangles Similar", "Select and justify the appropriate similarity criterion to prove that two triangles are similar."),
    ],
  },
  "M9GE-IIIe": {
    packTitle: "Right Triangle Similarity and Special Triangles",
    pacingLabel: "Right triangle similarity before special ratios",
    microLessons: [
      createSlice("Right Triangle Similarity Theorems", "Use altitude and right triangle similarity theorems to establish proportional relationships in right triangles."),
      createSlice("45-45-90 Triangles", "Derive and use the side relationships of 45-45-90 triangles."),
      createSlice("30-60-90 Triangles", "Derive and use the side relationships of 30-60-90 triangles."),
    ],
  },
  "M9GE-IIIf": {
    packTitle: "Applying Triangle Similarity",
    pacingLabel: "Proportionality to problem solving",
    microLessons: [
      createSlice("Fundamental Theorem of Proportionality", "Apply the fundamental theorem of proportionality to solve segment and side proportion problems."),
      createSlice("Solving for Unknown Measures Using Similarity", "Set up similarity-based proportions to determine missing lengths in geometric figures."),
      createSlice("Applications of Triangle Similarity", "Use triangle similarity to solve geometric and real-life measurement problems."),
    ],
  },
  "M9GE-IVa": {
    packTitle: "Six Trigonometric Ratios",
    pacingLabel: "Core ratios before reciprocal ratios",
    microLessons: [
      createSlice("Sine, Cosine, and Tangent", "Illustrate and compute the primary trigonometric ratios in right triangles."),
      createSlice("Secant, Cosecant, and Cotangent", "Illustrate and compute the reciprocal trigonometric ratios in right triangles."),
      createSlice("Choosing the Appropriate Ratio", "Select the correct trigonometric ratio based on the given sides or angles in a right triangle."),
    ],
  },
  "M9GE-IVb": {
    packTitle: "Special Angle Trigonometric Ratios",
    pacingLabel: "Special triangle by special triangle",
    microLessons: [
      createSlice("Ratios in a 45-45-90 Triangle", "Use the special right triangle relationships to determine trigonometric ratios of 45 degrees."),
      createSlice("Ratios in a 30-60-90 Triangle", "Use the special right triangle relationships to determine trigonometric ratios of 30 degrees and 60 degrees."),
      createSlice("Evaluating Expressions with Special Angles", "Compute trigonometric expressions involving special angles accurately."),
    ],
  },
  "M9GE-IVc": {
    packTitle: "Angles of Elevation and Depression",
    pacingLabel: "Angle interpretation in right-triangle contexts",
    microLessons: [
      createSlice("Angles of Elevation and Depression", "Represent and solve situations involving angles of elevation and angles of depression."),
    ],
  },
  "M9GE-IVd": {
    packTitle: "Solving Right Triangles",
    pacingLabel: "Triangle solving before real-life application",
    microLessons: [
      createSlice("Solving Right Triangles from Given Measures", "Determine missing sides and angles of a right triangle using suitable trigonometric ratios."),
      createSlice("Real-Life Problems Involving Right Triangles", "Use right triangle trigonometry to solve contextual measurement problems."),
    ],
  },
  "M9GE-IVf": {
    packTitle: "Laws of Sines and Cosines",
    pacingLabel: "Law by law",
    microLessons: [
      createSlice("Law of Sines and Its Applications", "Use the law of sines to solve oblique triangles when side-angle information is available."),
      createSlice("Law of Cosines and Its Applications", "Use the law of cosines to solve oblique triangles when side-side-side or side-angle-side information is available."),
    ],
  },
  "M9GE-IVh": {
    packTitle: "Oblique Triangles",
    pacingLabel: "Choose the law, then interpret the solution",
    microLessons: [
      createSlice("Choosing the Appropriate Law", "Decide whether the law of sines or the law of cosines should be used for a given oblique triangle."),
      createSlice("Solving Problems Involving Oblique Triangles", "Solve geometric and real-life problems involving oblique triangles and interpret the results."),
    ],
  },
  "M9SP-IVj": {
    packTitle: "Normal Standard Distribution",
    pacingLabel: "Curve first, then z-scores and table use",
    microLessons: [
      createSlice("Normal Curve and Standard Normal Values", "Illustrate the normal curve, describe its characteristics, and identify regions corresponding to standard normal values."),
      createSlice("Converting to Standard Normal Form", "Convert a normal random variable to a standard normal variable and interpret the corresponding z-score."),
      createSlice("Probabilities and Percentiles Using the Standard Normal Table", "Use the standard normal table to determine probabilities and percentiles and interpret them in context."),
    ],
  },
  "M10AL-Ib": {
    packTitle: "Arithmetic Sequences and Series",
    pacingLabel: "Pattern to nth term to sum",
    microLessons: [
      createSlice("Illustrating Arithmetic Sequences", "Recognize and generate arithmetic sequences by identifying the common difference."),
      createSlice("Arithmetic Means and nth Term", "Determine arithmetic means and derive or use the nth-term formula of an arithmetic sequence."),
      createSlice("Sum of an Arithmetic Sequence", "Determine the sum of the first n terms of an arithmetic sequence and interpret the result."),
    ],
  },
  "M10AL-Id": {
    packTitle: "Geometric Sequences and Series",
    pacingLabel: "Pattern to nth term to finite and infinite sums",
    microLessons: [
      createSlice("Illustrating Geometric Sequences", "Recognize and generate geometric sequences by identifying the common ratio."),
      createSlice("Geometric Means and nth Term", "Determine geometric means and use the nth-term formula of a geometric sequence."),
      createSlice("Finite and Infinite Geometric Series", "Find the sum of finite or infinite geometric series when the conditions are satisfied."),
    ],
  },
  "M10AL-If-1": {
    packTitle: "Other Sequences",
    pacingLabel: "Sequence family by sequence family",
    microLessons: [
      createSlice("Harmonic Sequences", "Illustrate harmonic sequences and relate them to the reciprocals of arithmetic sequences."),
      createSlice("Fibonacci Sequences", "Generate Fibonacci-type sequences and describe their recursive pattern."),
    ],
  },
  "M10AL-If-2": {
    packTitle: "Problems on Sequences and Series",
    pacingLabel: "Model arithmetic first, then geometric",
    microLessons: [
      createSlice("Modeling Problems with Arithmetic Sequences and Series", "Translate real-life situations into arithmetic sequence or arithmetic series models and solve them."),
      createSlice("Modeling Problems with Geometric Sequences and Series", "Translate real-life situations into geometric sequence or geometric series models and solve them."),
      createSlice("Choosing the Appropriate Sequence or Series Model", "Decide whether a problem is best modeled by an arithmetic or geometric pattern and justify the choice."),
    ],
  },
  "M10AL-Ig": {
    packTitle: "Polynomial Division",
    pacingLabel: "Algorithm first, then synthetic shortcut",
    microLessons: [
      createSlice("Long Division of Polynomials", "Perform polynomial division using the long-division algorithm."),
      createSlice("Synthetic Division of Polynomials", "Use synthetic division to divide suitable polynomials more efficiently."),
    ],
  },
  "M10AL-Ig-2": {
    packTitle: "Remainder and Factor Theorems",
    pacingLabel: "Theorem-based testing of values and factors",
    microLessons: [
      createSlice("Remainder and Factor Theorems", "Use the remainder theorem to evaluate polynomial expressions and remainders efficiently and use the factor theorem to determine whether a given binomial is a factor of a polynomial."),
    ],
  },
  "M10AL-Ih": {
    packTitle: "Factoring Polynomials",
    pacingLabel: "Basic patterns before theorem-based factoring",
    microLessons: [
      createSlice("Factoring by Common Factor and Grouping", "Factor polynomials using common monomial factors and grouping when appropriate."),
      createSlice("Factoring Special Polynomial Forms", "Factor polynomials using standard forms such as difference of squares and perfect-square trinomials."),
      createSlice("Factoring Using Factor Theorem and Division", "Factor higher-degree polynomials by combining the factor theorem with long or synthetic division."),
    ],
  },
  "M10AL-Ii": {
    packTitle: "Polynomial Equations",
    pacingLabel: "From factors and zeros to full equation solving",
    microLessons: [
      createSlice("Factors, Zeros, and Polynomial Equations", "Relate factors and zeros of a polynomial to the solutions of a polynomial equation."),
      createSlice("Solving Polynomial Equations by Factoring", "Solve polynomial equations by rewriting them in standard form and factoring completely."),
      createSlice("Solving Higher-Degree Polynomial Equations", "Solve higher-degree polynomial equations using factoring together with theorem-based tools when needed."),
    ],
  },
  "M10AL-IIa": {
    packTitle: "Polynomial Functions",
    pacingLabel: "Illustrate, graph, then interpret",
    microLessons: [
      createSlice("Illustrating Polynomial Functions", "Distinguish polynomial functions from non-polynomial functions and describe their basic structure."),
      createSlice("Graphing Polynomial Functions", "Sketch and analyze polynomial graphs using degree, intercepts, turning behavior, and end behavior."),
      createSlice("Solving Problems Involving Polynomial Functions", "Use polynomial functions and their graphs to model and solve contextual problems."),
    ],
  },
  "M10AL-IIb-1": {
    packTitle: "Descartes' Rule of Signs",
    pacingLabel: "Real-zero patterns through sign changes",
    microLessons: [
      createSlice("Applying Descartes' Rule to Positive and Negative Real Zeros", "Use sign changes in f(x) and f(-x) to predict the possible numbers of positive and negative real zeros and summarize the possible real-zero patterns."),
    ],
  },
  "M10AL-IIb-2": {
    packTitle: "Rational Root Theorem",
    pacingLabel: "Candidate roots before verification",
    microLessons: [
      createSlice("Listing Possible Rational Roots", "Use the rational root theorem to generate the possible rational zeros of a polynomial."),
      createSlice("Testing Candidates and Confirming Zeros", "Test rational-root candidates using substitution or synthetic division and confirm which values are actual zeros."),
    ],
  },
  "M10GE-IId": {
    packTitle: "Circle Relationships",
    pacingLabel: "Parts first, then chord-arc-angle relations",
    microLessons: [
      createSlice("Parts of a Circle, Arcs, and Central Angles", "Illustrate the parts of a circle and relate central angles to their intercepted arcs."),
      createSlice("Relationships Among Chords, Arcs, and Central Angles", "Derive and apply relationships among chords, arcs, and central angles of a circle."),
    ],
  },
  "M10GE-IId-2": {
    packTitle: "Inscribed Angles",
    pacingLabel: "From theorem to problem solving",
    microLessons: [
      createSlice("Inscribed Angle Theorem", "Relate inscribed angles to their intercepted arcs and compare them with central angles."),
      createSlice("Theorems on Inscribed Angles and Related Circles", "Apply theorems on inscribed angles, angles in semicircles, and cyclic quadrilaterals."),
      createSlice("Solving Problems Involving Inscribed Angles", "Solve for unknown arcs and angles using inscribed-angle relationships."),
    ],
  },
  "M10GE-IIe": {
    packTitle: "Secants, Tangents, and Segments",
    pacingLabel: "Illustrate first, then prove and apply",
    microLessons: [
      createSlice("Secants, Tangents, Segments, and Sectors", "Illustrate secants, tangents, segments, and sectors associated with circles."),
      createSlice("Theorems on Tangents and Secants", "Prove and apply angle and segment theorems involving tangents and secants."),
      createSlice("Solving Problems with Tangent and Secant Relationships", "Solve for lengths and angle measures using tangent-secant and segment relationships."),
    ],
  },
  "M10GE-IIf": {
    packTitle: "Problems on Circles",
    pacingLabel: "Integrate circle theorems in context",
    microLessons: [
      createSlice("Choosing the Right Circle Theorem", "Identify which theorem or relationship on circles is appropriate for a given problem."),
      createSlice("Routine Problems on Circles", "Solve structured problems involving arcs, chords, central angles, inscribed angles, tangents, and secants."),
      createSlice("Non-Routine and Contextual Problems on Circles", "Solve richer circle problems that require combining multiple relationships or interpreting a real situation."),
    ],
  },
  "M10GE-IIg": {
    packTitle: "Distance Formula",
    pacingLabel: "Derive first, then apply and prove",
    microLessons: [
      createSlice("Deriving the Distance Formula", "Derive the distance formula from the Pythagorean theorem on the coordinate plane."),
      createSlice("Applying the Distance Formula", "Use the distance formula to find lengths of segments and distances between points."),
      createSlice("Using Distance Formula in Coordinate Proof", "Apply the distance formula to verify geometric properties on the coordinate plane."),
    ],
  },
  "M10GE-IIh": {
    packTitle: "Equation of a Circle",
    pacingLabel: "Standard form to graphing and reverse tasks",
    microLessons: [
      createSlice("Standard Form of the Equation of a Circle", "Relate the center and radius of a circle to its standard equation."),
      createSlice("Graphing a Circle from Its Equation", "Graph a circle on the coordinate plane given its equation, center, and radius."),
      createSlice("Finding the Equation from Given Circle Information", "Write the equation of a circle from its center and radius or from geometric conditions."),
    ],
  },
  "M7SP-IVa": {
    packTitle: "Introduction to Statistics",
    pacingLabel: "From questions to investigation design",
    microLessons: [
      createSlice("Statistical Questions and Investigation Planning", "Differentiate statistical questions from non-statistical questions and identify situations that require data and the data needed for a solvable statistical investigation."),
    ],
  },
  "M7SP-IVb": {
    packTitle: "Data Collection and Frequency Distribution",
    pacingLabel: "From collected data to organized displays",
    microLessons: [
      createSlice("Gathering and Classifying Data with Frequency Tables", "Identify types of data and gather statistical data using simple instruments and organize collected data into frequency distribution tables."),
    ],
  },
  "M7SP-IVh": {
    packTitle: "Measures of Variability",
    pacingLabel: "Illustrate first, then calculate",
    microLessons: [
      createSlice("Understanding Variability", "Illustrate the meaning of variability and explain why spread matters in describing data."),
      createSlice("Calculating Measures of Variability", "Calculate appropriate measures of variability for grouped and ungrouped data."),
      createSlice("Interpreting Variability", "Use variability measures together with central tendency to describe and compare data sets."),
    ],
  },
  "M7SP-IVj": {
    packTitle: "Interpreting Data and Drawing Conclusions",
    pacingLabel: "Analyze first, then conclude",
    microLessons: [
      createSlice("Analyzing Tabular and Graphical Data", "Analyze data presented in tables and graphs using suitable statistical measures."),
      createSlice("Drawing Conclusions from Data", "Make evidence-based conclusions and justify them using tabular, graphical, and numerical information."),
    ],
  },
  "M10SP-IVa": {
    packTitle: "Measures of Position",
    pacingLabel: "Ungrouped to grouped quartiles",
    microLessons: [
      createSlice("Quartiles of Ungrouped Data", "Illustrate and calculate quartiles for ungrouped data sets."),
      createSlice("Quartiles of Grouped Data", "Determine quartiles for grouped data using class intervals and cumulative frequencies."),
      createSlice("Interpreting Quartiles", "Interpret quartile positions and use them to describe how data are distributed."),
    ],
  },
  "M10SP-IVb": {
    packTitle: "Measures of Position",
    pacingLabel: "Deciles and percentiles from computation to interpretation",
    microLessons: [
      createSlice("Deciles and Percentiles of Ungrouped Data", "Compute and locate deciles and percentiles for ungrouped data."),
      createSlice("Deciles and Percentiles of Grouped Data", "Compute and locate deciles and percentiles for grouped data."),
      createSlice("Interpreting Measures of Position", "Explain what deciles and percentiles say about relative standing and distribution."),
    ],
  },
  "M10SP-IIIg": {
    packTitle: "Probability of Union and Intersection",
    pacingLabel: "Event relationships before computation",
    microLessons: [
      createSlice("Union, Intersection, and Venn Diagrams", "Illustrate unions and intersections of events using sets and Venn diagrams."),
      createSlice("Mutually Exclusive and Overlapping Events", "Distinguish mutually exclusive events from overlapping events and relate the distinction to probability rules."),
      createSlice("Computing Probability of Union and Intersection", "Compute probabilities of unions and intersections using event relationships and appropriate formulas."),
    ],
  },
  "M10SP-IIIa": {
    packTitle: "Permutations",
    pacingLabel: "Illustrate, derive, then solve",
    microLessons: [
      createSlice("Factorial Notation and Linear Arrangements", "Illustrate linear arrangements of distinguishable objects and connect them to factorial notation."),
      createSlice("Permutation Formula", "Derive and use the permutation formula for n objects taken r at a time."),
      createSlice("Problems Involving Permutations", "Solve routine and contextual problems involving linear permutations."),
    ],
  },
  "M10SP-IIIb-1": {
    packTitle: "Circular Permutations",
    pacingLabel: "Circular arrangements from model to solution",
    microLessons: [
      createSlice("Illustrating and Solving Circular Permutations", "Represent circular arrangements and compare them with linear arrangements and solve counting problems involving circular permutations."),
    ],
  },
  "M10SP-IIIb-2": {
    packTitle: "Permutations with Repetition",
    pacingLabel: "Repeated-object arrangements in context",
    microLessons: [
      createSlice("Counting and Solving Permutations with Repetition", "Count distinct arrangements when some objects are identical and solve contextual problems involving permutations with repeated objects."),
    ],
  },
  "M10SP-IIIc": {
    packTitle: "Combinations",
    pacingLabel: "Differentiate, derive, then solve",
    microLessons: [
      createSlice("Illustrating Combinations", "Distinguish combinations from permutations and identify situations where order does not matter."),
      createSlice("Combination Formula", "Derive and use the combination formula for selecting objects without regard to order."),
      createSlice("Problems Involving Combinations", "Solve routine and contextual problems involving combinations."),
    ],
  },
  "M10SP-IIIf": {
    packTitle: "Permutations and Combinations",
    pacingLabel: "Choose, model, then solve",
    microLessons: [
      createSlice("Permutation or Combination?", "Decide whether a counting problem should be modeled using permutation or combination."),
      createSlice("Modeling Counting Situations", "Translate verbal situations into an appropriate counting model before solving."),
      createSlice("Contextual Counting Problems", "Solve multi-step real-life problems involving permutations and combinations."),
    ],
  },
  "M10SP-IIIh": {
    packTitle: "Conditional Probability",
    pacingLabel: "Dependence before conditional computation",
    microLessons: [
      createSlice("Independent and Dependent Events", "Identify whether events are independent or dependent and explain how one event affects another."),
      createSlice("Computing Conditional Probability", "Compute conditional probabilities using formulas, tables, diagrams, or sample-space reasoning."),
      createSlice("Conditional Probability in Context", "Interpret and solve contextual problems involving conditional probability."),
    ],
  },
  "M10SP-IVd": {
    packTitle: "Box-and-Whisker Plot",
    pacingLabel: "Read and interpret distribution features together",
    microLessons: [
      createSlice("Reading a Box-and-Whisker Plot and Interpreting Distribution", "Identify the five-number summary from a box-and-whisker plot and use a box plot to describe spread, clustering, skew, and possible outliers."),
    ],
  },
  "M10SP-IVf": {
    packTitle: "Statistical Mini-Research",
    pacingLabel: "Analyze first, then design descriptive research",
    microLessons: [
      createSlice("Analyzing and Interpreting Research Data", "Choose appropriate descriptive measures and interpret data based on the level of measurement and research purpose."),
      createSlice("Descriptive Mini-Research", "Formulate and carry out a small descriptive research task using suitable statistical methods."),
    ],
  },
};

export function enrichLesson(lesson) {
  const override = SEQUENCE_OVERRIDES[lesson.code];

  if (override) {
    const microLessons = finalizeMicroLessons(lesson.code, override.microLessons);

    return {
      ...lesson,
      durationMinutes: DEFAULT_DURATION_MINUTES,
      packTitle: override.packTitle,
      pacingLabel: override.pacingLabel,
      microLessons,
      sliceCount: microLessons.length,
      isCuratedSequence: true,
    };
  }

  const packTitle = getPackTitle(lesson.topic);
  const microLessons = finalizeMicroLessons(lesson.code, [
    createSlice(
      lesson.topic,
      `Teach ${lesson.topic} as one focused 45-minute lesson with practice and checking embedded inside the lesson itself.`,
    ),
  ]);

  return {
    ...lesson,
    durationMinutes: DEFAULT_DURATION_MINUTES,
    packTitle,
    pacingLabel: "Single focused lesson",
    microLessons,
    sliceCount: microLessons.length,
    isCuratedSequence: false,
  };
}

function createSlice(title, goal) {
  return { title, goal };
}

function finalizeMicroLessons(code, microLessons) {
  return microLessons.map((microLesson, index) => {
    return {
      ...microLesson,
      sequenceNo: index + 1,
      sliceId: `${code}-S${String(index + 1).padStart(2, "0")}`,
    };
  });
}

function getPackTitle(topic) {
  const [prefix] = topic.split(":");
  return prefix.trim();
}
