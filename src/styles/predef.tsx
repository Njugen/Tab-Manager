import styles from "./../styles/global_utils.module.scss";

const textfield: string = `${styles.input_textfield} text-sm text-tbfColor-darkergrey rounded-lg p-3 border border-tbfColor-middlegrey4`;
const textarea: string = `${styles.input_textfield} text-sm resize-none h-20 text-tbfColor-darkergrey rounded-lg p-3 border border-tbfColor-middlegrey4`;

const textfield_full: string = `${styles.input_textfield} w-full text-sm text-tbfColor-darkergrey rounded-lg p-3 border border-tbfColor-middlegrey4`;
const textarea_full: string = `${styles.input_textfield} w-full text-sm resize-none h-36 text-tbfColor-darkergrey rounded-lg p-3 border border-tbfColor-middlegrey4`;

export { textfield, textarea, textfield_full, textarea_full };
