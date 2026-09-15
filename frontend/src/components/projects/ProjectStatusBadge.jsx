import Badge from '../common/Badge';
import { PROJECT_STATUS_STYLES } from '../../utils/constants';

export default function ProjectStatusBadge({ status }) {
  return <Badge className={PROJECT_STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'}>{status}</Badge>;
}
