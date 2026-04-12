import {
  FaUserMd, FaHospital, FaHandHoldingHeart, FaGlobe,
  FaAward, FaMicroscope, FaGlobeAmericas, FaHeart,
  FaUsers, FaPray, FaQuoteLeft,
} from 'react-icons/fa';
import { FiCheckCircle, FiCheck } from 'react-icons/fi';

const ICON_MAP = {
  FaUserMd, FaHospital, FaHandHoldingHeart, FaGlobe,
  FaAward, FaMicroscope, FaGlobeAmericas, FaHeart,
  FaUsers, FaPray, FaQuoteLeft,
  FiCheckCircle, FiCheck,
};

export default function getIcon(name) {
  return ICON_MAP[name] || null;
}
